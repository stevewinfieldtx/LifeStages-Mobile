import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// Send daily Verse of the Day push notification to all registered devices
// Called by cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's verse
    const today = new Date().toISOString().split('T')[0]
    const { data: verse } = await supabaseAdmin
      .from('verses')
      .select('verse_reference, verse_text')
      .eq('date', today)
      .is('church_id', null)
      .single()

    if (!verse || !verse.verse_reference) {
      return NextResponse.json({ error: 'No verse found for today' }, { status: 404 })
    }

    // Get all registered push tokens
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('push_tokens')
      .select('token, platform')

    if (tokensError || !tokens?.length) {
      return NextResponse.json({ error: 'No registered devices', count: 0 })
    }

    // Separate iOS and Android tokens
    const iosTokens = tokens.filter(t => t.platform === 'ios').map(t => t.token)
    const androidTokens = tokens.filter(t => t.platform === 'android').map(t => t.token)

    const results = { ios: 0, android: 0, errors: 0 }

    // Send to iOS via APNs
    if (iosTokens.length > 0) {
      const apnsResult = await sendAPNS(iosTokens, verse.verse_reference, verse.verse_text)
      results.ios = apnsResult.sent
      results.errors += apnsResult.errors
    }

    // Send to Android via FCM
    if (androidTokens.length > 0) {
      const fcmResult = await sendFCM(androidTokens, verse.verse_reference, verse.verse_text)
      results.android = fcmResult.sent
      results.errors += fcmResult.errors
    }

    return NextResponse.json({
      success: true,
      verse: verse.verse_reference,
      date: today,
      ...results,
    })
  } catch (error) {
    console.error('[Push VOTD] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// ============================================
// Apple Push Notification Service (APNs)
// ============================================
async function sendAPNS(
  tokens: string[],
  reference: string,
  text: string
): Promise<{ sent: number; errors: number }> {
  // APNs requires a signed JWT or certificate-based auth
  // Using HTTP/2 APNs provider API
  const teamId = process.env.APNS_TEAM_ID
  const keyId = process.env.APNS_KEY_ID
  const bundleId = process.env.APNS_BUNDLE_ID || 'com.lifestagesai.bible'

  if (!teamId || !keyId) {
    console.warn('[APNs] Missing APNS_TEAM_ID or APNS_KEY_ID — skipping iOS push')
    return { sent: 0, errors: 0 }
  }

  // Truncate verse text for notification body
  const body = text.length > 150 ? text.substring(0, 147) + '...' : text

  const payload = JSON.stringify({
    aps: {
      alert: {
        title: `Today's Verse: ${reference}`,
        body,
      },
      sound: 'default',
      badge: 1,
    },
    data: {
      type: 'votd',
      reference,
    },
  })

  let sent = 0
  let errors = 0

  for (const token of tokens) {
    try {
      const response = await fetch(
        `https://api.push.apple.com/3/device/${token}`,
        {
          method: 'POST',
          headers: {
            'apns-topic': bundleId,
            'apns-push-type': 'alert',
            'apns-priority': '5',
            'content-type': 'application/json',
            authorization: `bearer ${await getAPNsJWT()}`,
          },
          body: payload,
        }
      )
      if (response.ok) {
        sent++
      } else {
        errors++
        const err = await response.text()
        console.error(`[APNs] Failed for token ${token.slice(0, 8)}...:`, err)
        // Remove invalid tokens
        if (response.status === 410) {
          await removeToken(token)
        }
      }
    } catch (e) {
      errors++
      console.error('[APNs] Send error:', e)
    }
  }

  return { sent, errors }
}

// ============================================
// Firebase Cloud Messaging (FCM) for Android
// ============================================
async function sendFCM(
  tokens: string[],
  reference: string,
  text: string
): Promise<{ sent: number; errors: number }> {
  const fcmServerKey = process.env.FCM_SERVER_KEY

  if (!fcmServerKey) {
    console.warn('[FCM] Missing FCM_SERVER_KEY — skipping Android push')
    return { sent: 0, errors: 0 }
  }

  const body = text.length > 150 ? text.substring(0, 147) + '...' : text

  let sent = 0
  let errors = 0

  // FCM supports batch of up to 500 tokens
  const batchSize = 500
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${fcmServerKey}`,
        },
        body: JSON.stringify({
          registration_ids: batch,
          notification: {
            title: `Today's Verse: ${reference}`,
            body,
            sound: 'default',
          },
          data: {
            type: 'votd',
            reference,
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()
        sent += result.success || 0
        errors += result.failure || 0

        // Clean up invalid tokens
        if (result.results) {
          for (let j = 0; j < result.results.length; j++) {
            if (result.results[j].error === 'NotRegistered' ||
                result.results[j].error === 'InvalidRegistration') {
              await removeToken(batch[j])
            }
          }
        }
      } else {
        errors += batch.length
      }
    } catch (e) {
      errors += batch.length
      console.error('[FCM] Send error:', e)
    }
  }

  return { sent, errors }
}

// ============================================
// Helpers
// ============================================

// Generate APNs JWT — in production, use the .p8 key file
async function getAPNsJWT(): Promise<string> {
  // This is a placeholder — in production you'd sign a JWT using
  // your APNs .p8 key, team ID, and key ID.
  // For now, return the pre-signed token from env if available.
  return process.env.APNS_AUTH_TOKEN || ''
}

// Remove stale/invalid token from database
async function removeToken(token: string) {
  await supabaseAdmin
    .from('push_tokens')
    .delete()
    .eq('token', token)
}
