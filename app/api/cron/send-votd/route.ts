import { NextResponse } from 'next/server'

// Vercel Cron calls this daily to trigger VOTD push notifications
// Configure in vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/send-votd",
//     "schedule": "0 11 * * *"  // 6 AM Central (11 UTC)
//   }]
// }

export async function GET(request: Request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Cron] Triggering daily VOTD push')

  try {
    // Call the push send endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/push/send-votd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronSecret}`,
      },
    })

    const result = await response.json()
    console.log('[Cron] VOTD push result:', result)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('[Cron] VOTD push failed:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return GET(request)
}
