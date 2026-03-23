import { NextResponse } from 'next/server'
import { getChurchBySlug, verifyChurchAdmin } from '@/lib/church'
import {
  scrapeAndIndexChurchWebsite,
  searchChurchKnowledgeBase,
  getChurchKBStats,
  deleteChurchKB,
  syncAllChurchKBs
} from '@/lib/church-website'

// =====================================================
// GET - Search KB or get stats
// =====================================================
export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  const churchId = url.searchParams.get('churchId')
  const action = url.searchParams.get('action') || 'stats'
  const query = url.searchParams.get('query')
  
  // Allow search by churchId (for voice agent) or slug (for admin)
  let church = null
  
  if (churchId) {
    // Direct churchId lookup (for voice agent function calls)
    const { data } = await (await import('@/lib/supabase')).supabaseAdmin
      .from('churches')
      .select('*')
      .eq('id', churchId)
      .single()
    church = data
  } else if (slug) {
    church = await getChurchBySlug(slug)
  }
  
  if (!church) {
    return NextResponse.json({ error: 'Church not found' }, { status: 404 })
  }
  
  try {
    switch (action) {
      case 'search':
        // Search the knowledge base
        if (!query) {
          return NextResponse.json({ error: 'Query required for search' }, { status: 400 })
        }
        
        const matchCount = parseInt(url.searchParams.get('limit') || '5')
        const threshold = parseFloat(url.searchParams.get('threshold') || '0.7')
        
        const results = await searchChurchKnowledgeBase(
          church.id,
          query,
          matchCount,
          threshold
        )
        
        return NextResponse.json({ 
          results,
          query,
          church_name: church.name
        })
      
      case 'stats':
        // Get KB stats (for admin dashboard)
        const stats = await getChurchKBStats(church.id)
        return NextResponse.json({
          church_id: church.id,
          church_name: church.name,
          website_url: church.website_url,
          ...stats
        })
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Website KB API] GET Error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}

// =====================================================
// POST - Trigger scrape or sync
// =====================================================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, adminEmail, action, forceRefresh } = body
    
    // Special action: nightly sync (called by cron)
    if (action === 'sync_all') {
      // Verify cron secret
      const cronSecret = request.headers.get('x-cron-secret')
      if (cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      console.log('[Website KB API] Starting nightly sync')
      const result = await syncAllChurchKBs()
      return NextResponse.json({ 
        success: true, 
        message: 'Nightly sync complete',
        ...result 
      })
    }
    
    // Regular actions require church context
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }
    
    const church = await getChurchBySlug(slug)
    if (!church) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 })
    }
    
    // Verify admin for scrape actions
    if (adminEmail) {
      const verified = await verifyChurchAdmin(slug, adminEmail)
      if (!verified) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
      }
    }
    
    switch (action) {
      case 'scrape':
        // Trigger scrape
        if (!church.website_url) {
          return NextResponse.json({ 
            error: 'No website URL configured for this church' 
          }, { status: 400 })
        }
        
        console.log(`[Website KB API] Starting scrape for ${church.name}`)
        const result = await scrapeAndIndexChurchWebsite(
          church.id,
          church.website_url,
          forceRefresh === true
        )
        
        return NextResponse.json({
          success: true,
          message: result.status === 'completed' 
            ? `Indexed ${result.pages_scraped} pages (${result.pages_updated} updated, ${result.total_chunks} chunks)`
            : `Scrape failed: ${result.error_message}`,
          log: result
        })
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Website KB API] POST Error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}

// =====================================================
// DELETE - Clear KB
// =====================================================
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { slug, adminEmail } = body
    
    if (!slug || !adminEmail) {
      return NextResponse.json({ error: 'Missing slug or adminEmail' }, { status: 400 })
    }
    
    // Verify admin
    const verified = await verifyChurchAdmin(slug, adminEmail)
    if (!verified) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    const { church } = verified
    
    const success = await deleteChurchKB(church.id)
    
    return NextResponse.json({
      success,
      message: success ? 'Knowledge base cleared' : 'Failed to clear knowledge base'
    })
  } catch (error) {
    console.error('[Website KB API] DELETE Error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}
