import { supabaseAdmin } from './supabase'
import crypto from 'crypto'

// =====================================================
// TYPES
// =====================================================

export interface WebsiteChunk {
  id: string
  church_id: string
  url: string
  page_title: string | null
  content: string
  content_hash: string
  embedding: number[] | null
  chunk_index: number
  last_scraped: string
  created_at: string
}

export interface ScrapeLog {
  id: string
  church_id: string
  status: 'started' | 'completed' | 'failed'
  pages_scraped: number
  pages_updated: number
  pages_unchanged: number
  total_chunks: number
  started_at: string
  completed_at: string | null
  error_message: string | null
}

export interface ScrapedPage {
  url: string
  title: string
  content: string
  links: string[]
}

// =====================================================
// CONFIGURATION
// =====================================================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const EMBEDDING_MODEL = 'openai/text-embedding-3-small'
const MAX_CHUNK_SIZE = 1000 // characters per chunk
const MAX_PAGES_PER_SCRAPE = 50 // limit pages per church
const SCRAPE_DELAY_MS = 500 // be nice to servers

// =====================================================
// EMBEDDING GENERATION
// =====================================================

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bibleforlifestages.com',
      'X-Title': 'Life Stages Church KB'
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Embedding API error: ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

// =====================================================
// WEB SCRAPING
// =====================================================

export async function scrapePage(url: string): Promise<ScrapedPage | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LifeStagesBot/1.0 (Church Knowledge Base Builder)'
      }
    })

    if (!response.ok) {
      console.log(`[Scraper] Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    // Extract main content (remove scripts, styles, nav, footer, etc.)
    let content = html
      // Remove scripts and styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove nav, header, footer, aside
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      // Remove HTML tags but keep text
      .replace(/<[^>]+>/g, ' ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()

    // Extract internal links for crawling
    const linkRegex = /href=["']([^"']+)["']/gi
    const links: string[] = []
    let match
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1]
      // Only follow internal links
      if (href.startsWith('/') || href.startsWith(new URL(url).origin)) {
        try {
          const fullUrl = new URL(href, url).href
          // Skip anchors, files, etc
          if (!fullUrl.includes('#') && 
              !fullUrl.match(/\.(pdf|jpg|jpeg|png|gif|svg|css|js|xml|json)$/i)) {
            links.push(fullUrl)
          }
        } catch {}
      }
    }

    return { url, title, content, links }
  } catch (error) {
    console.error(`[Scraper] Error scraping ${url}:`, error)
    return null
  }
}

// =====================================================
// CONTENT CHUNKING
// =====================================================

export function chunkContent(content: string, maxSize: number = MAX_CHUNK_SIZE): string[] {
  const chunks: string[] = []
  
  // Split by sentences first
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content]
  
  let currentChunk = ''
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks.filter(c => c.length > 50) // Skip tiny chunks
}

function hashContent(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex')
}

// =====================================================
// MAIN SCRAPE & INDEX FUNCTION
// =====================================================

export async function scrapeAndIndexChurchWebsite(
  churchId: string,
  websiteUrl: string,
  forceRefresh: boolean = false
): Promise<ScrapeLog> {
  console.log(`[WebsiteKB] Starting scrape for church ${churchId}: ${websiteUrl}`)
  
  // Create scrape log entry
  const { data: logEntry } = await supabaseAdmin
    .from('church_website_scrape_log')
    .insert({
      church_id: churchId,
      status: 'started'
    })
    .select()
    .single()

  const logId = logEntry?.id

  try {
    // Normalize URL
    const baseUrl = new URL(websiteUrl).origin
    
    // Track what we've scraped
    const visited = new Set<string>()
    const toVisit: string[] = [baseUrl, websiteUrl]
    const pages: ScrapedPage[] = []

    // Crawl the site
    while (toVisit.length > 0 && pages.length < MAX_PAGES_PER_SCRAPE) {
      const url = toVisit.shift()!
      
      // Normalize and check if visited
      const normalizedUrl = url.split('?')[0].replace(/\/$/, '')
      if (visited.has(normalizedUrl)) continue
      
      // Only crawl same domain
      try {
        if (new URL(url).origin !== baseUrl) continue
      } catch { continue }
      
      visited.add(normalizedUrl)
      
      console.log(`[WebsiteKB] Scraping: ${url}`)
      const page = await scrapePage(url)
      
      if (page && page.content.length > 100) {
        pages.push(page)
        
        // Add discovered links to queue
        for (const link of page.links) {
          const normalizedLink = link.split('?')[0].replace(/\/$/, '')
          if (!visited.has(normalizedLink) && !toVisit.includes(link)) {
            toVisit.push(link)
          }
        }
      }
      
      // Be nice to the server
      await new Promise(r => setTimeout(r, SCRAPE_DELAY_MS))
    }

    console.log(`[WebsiteKB] Scraped ${pages.length} pages`)

    // Get existing chunks for change detection
    const { data: existingChunks } = await supabaseAdmin
      .from('church_website_chunks')
      .select('url, content_hash')
      .eq('church_id', churchId)

    const existingHashes = new Map(
      (existingChunks || []).map(c => [c.url, c.content_hash])
    )

    // Process each page
    let pagesUpdated = 0
    let pagesUnchanged = 0
    let totalChunks = 0

    for (const page of pages) {
      const contentHash = hashContent(page.content)
      
      // Check if content changed
      if (!forceRefresh && existingHashes.get(page.url) === contentHash) {
        pagesUnchanged++
        console.log(`[WebsiteKB] Unchanged: ${page.url}`)
        continue
      }

      // Delete old chunks for this URL
      await supabaseAdmin
        .from('church_website_chunks')
        .delete()
        .eq('church_id', churchId)
        .eq('url', page.url)

      // Chunk the content
      const chunks = chunkContent(page.content)
      console.log(`[WebsiteKB] Processing ${page.url}: ${chunks.length} chunks`)

      // Generate embeddings and store
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        
        try {
          // Generate embedding
          const embedding = await generateEmbedding(chunk)
          
          // Store chunk with embedding
          await supabaseAdmin
            .from('church_website_chunks')
            .insert({
              church_id: churchId,
              url: page.url,
              page_title: page.title,
              content: chunk,
              content_hash: contentHash,
              embedding: embedding,
              chunk_index: i,
              last_scraped: new Date().toISOString()
            })

          totalChunks++
        } catch (error) {
          console.error(`[WebsiteKB] Error embedding chunk ${i} from ${page.url}:`, error)
        }
        
        // Small delay between embeddings
        await new Promise(r => setTimeout(r, 100))
      }

      pagesUpdated++
    }

    // Update church record
    await supabaseAdmin
      .from('churches')
      .update({
        voice_agent_last_kb_sync: new Date().toISOString(),
        voice_agent_kb_pages_indexed: pages.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', churchId)

    // Update scrape log
    const { data: completedLog } = await supabaseAdmin
      .from('church_website_scrape_log')
      .update({
        status: 'completed',
        pages_scraped: pages.length,
        pages_updated: pagesUpdated,
        pages_unchanged: pagesUnchanged,
        total_chunks: totalChunks,
        completed_at: new Date().toISOString()
      })
      .eq('id', logId)
      .select()
      .single()

    console.log(`[WebsiteKB] Complete! ${pages.length} pages, ${totalChunks} chunks, ${pagesUpdated} updated`)
    
    return completedLog!

  } catch (error) {
    console.error('[WebsiteKB] Scrape failed:', error)
    
    // Update log with error
    const { data: failedLog } = await supabaseAdmin
      .from('church_website_scrape_log')
      .update({
        status: 'failed',
        error_message: String(error),
        completed_at: new Date().toISOString()
      })
      .eq('id', logId)
      .select()
      .single()

    return failedLog!
  }
}

// =====================================================
// KNOWLEDGE BASE SEARCH
// =====================================================

export async function searchChurchKnowledgeBase(
  churchId: string,
  query: string,
  matchCount: number = 5,
  matchThreshold: number = 0.7
): Promise<Array<{
  url: string
  page_title: string | null
  content: string
  similarity: number
}>> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)
    
    // Search using the Supabase function
    const { data, error } = await supabaseAdmin.rpc('search_church_website_kb', {
      p_church_id: churchId,
      p_query_embedding: queryEmbedding,
      p_match_threshold: matchThreshold,
      p_match_count: matchCount
    })

    if (error) {
      console.error('[WebsiteKB] Search error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[WebsiteKB] Search failed:', error)
    return []
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export async function getChurchKBStats(churchId: string): Promise<{
  totalChunks: number
  totalPages: number
  lastSync: string | null
}> {
  const { data: church } = await supabaseAdmin
    .from('churches')
    .select('voice_agent_last_kb_sync, voice_agent_kb_pages_indexed')
    .eq('id', churchId)
    .single()

  const { count } = await supabaseAdmin
    .from('church_website_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('church_id', churchId)

  return {
    totalChunks: count || 0,
    totalPages: church?.voice_agent_kb_pages_indexed || 0,
    lastSync: church?.voice_agent_last_kb_sync || null
  }
}

export async function deleteChurchKB(churchId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('church_website_chunks')
    .delete()
    .eq('church_id', churchId)

  if (error) {
    console.error('[WebsiteKB] Delete failed:', error)
    return false
  }

  await supabaseAdmin
    .from('churches')
    .update({
      voice_agent_last_kb_sync: null,
      voice_agent_kb_pages_indexed: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', churchId)

  return true
}

// =====================================================
// NIGHTLY SYNC CHECK
// =====================================================

export async function syncAllChurchKBs(): Promise<{
  processed: number
  updated: number
  failed: number
}> {
  // Get all churches with voice agent enabled
  const { data: churches } = await supabaseAdmin
    .from('churches')
    .select('id, website_url, voice_agent_last_kb_sync')
    .eq('voice_agent_enabled', true)
    .not('website_url', 'is', null)

  if (!churches || churches.length === 0) {
    return { processed: 0, updated: 0, failed: 0 }
  }

  let processed = 0
  let updated = 0
  let failed = 0

  for (const church of churches) {
    processed++
    
    try {
      const result = await scrapeAndIndexChurchWebsite(
        church.id,
        church.website_url!,
        false // Don't force refresh - only update changed pages
      )
      
      if (result.status === 'completed' && result.pages_updated > 0) {
        updated++
      }
    } catch (error) {
      console.error(`[WebsiteKB] Sync failed for church ${church.id}:`, error)
      failed++
    }
    
    // Delay between churches
    await new Promise(r => setTimeout(r, 2000))
  }

  return { processed, updated, failed }
}
