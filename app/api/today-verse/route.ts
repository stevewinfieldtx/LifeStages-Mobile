import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Get today's verse directly from database - FAST, no LLM needed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('church_id') || null
    
    const today = new Date().toISOString().split('T')[0]
    console.log('[Today Verse] Looking up date:', today)
    
    // Try church-specific verse first
    if (churchId) {
      const { data: churchVerse } = await supabaseAdmin
        .from('verses')
        .select('verse_reference, verse_text, bible_url')
        .eq('date', today)
        .eq('church_id', churchId)
        .single()
      
      if (churchVerse) {
        return NextResponse.json({
          reference: churchVerse.verse_reference,
          text: churchVerse.verse_text,
          version: 'NIV',
          bible_url: churchVerse.bible_url,
          source: 'church'
        })
      }
    }

    // Fall back to default schedule
    const { data: defaultVerse, error } = await supabaseAdmin
      .from('verses')
      .select('verse_reference, verse_text, bible_url')
      .eq('date', today)
      .is('church_id', null)
      .single()

    if (!error && defaultVerse) {
      return NextResponse.json({
        reference: defaultVerse.verse_reference,
        text: defaultVerse.verse_text,
        version: 'NIV',
        bible_url: defaultVerse.bible_url,
        source: 'database'
      })
    }

    console.log('[Today Verse] No verse in database for', today, '- returning null to trigger fallback')
    
    // Return null so the frontend knows to use generate-verse API instead
    return NextResponse.json({
      reference: null,
      text: null,
      version: null,
      source: 'none',
      message: `No verse in database for ${today}`
    })

  } catch (error) {
    console.error('[Today Verse] Error:', error)
    return NextResponse.json({
      reference: null,
      text: null,
      version: null,
      source: 'error',
      message: String(error)
    })
  }
}
