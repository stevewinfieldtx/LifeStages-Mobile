import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Save or update a device push token
export async function POST(request: NextRequest) {
  try {
    const { token, platform, email } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Upsert: if this token already exists, update it; otherwise insert
    const { error } = await supabaseAdmin
      .from('push_tokens')
      .upsert(
        {
          token,
          platform: platform || 'unknown', // 'ios' | 'android'
          email: email?.toLowerCase() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'token' }
      )

    if (error) {
      console.error('[Push Register] Error saving token:', error)
      return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Push Register] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
