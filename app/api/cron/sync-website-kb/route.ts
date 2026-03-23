import { NextResponse } from 'next/server'
import { syncAllChurchKBs } from '@/lib/church-website'

// This endpoint is called nightly by Vercel Cron
// Configure in vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/sync-website-kb",
//     "schedule": "0 3 * * *"  // 3 AM UTC daily
//   }]
// }

export async function GET(request: Request) {
  // Verify cron authorization
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Vercel sends this header for cron jobs
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  
  // Allow if Vercel cron OR if correct secret provided
  if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    console.log('[Cron] Unauthorized sync attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  console.log('[Cron] Starting nightly website KB sync')
  
  try {
    const startTime = Date.now()
    const result = await syncAllChurchKBs()
    const duration = Date.now() - startTime
    
    console.log(`[Cron] Sync complete in ${duration}ms:`, result)
    
    return NextResponse.json({
      success: true,
      message: 'Nightly sync complete',
      duration_ms: duration,
      ...result
    })
  } catch (error) {
    console.error('[Cron] Sync failed:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
