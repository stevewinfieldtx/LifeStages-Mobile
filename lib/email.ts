import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Bible for Life Stages <verse@bibleforlifestages.com>'

export async function sendVOTDEmail(
  emails: string[],
  reference: string,
  verseText: string
): Promise<{ sent: number; errors: number }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email')
    return { sent: 0, errors: 0 }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Daily Verse</title>
</head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1a;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1030;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;color:#f0e6ff;font-family:Arial,sans-serif;text-transform:uppercase;">Bible for Life Stages</p>
              <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:normal;">Your Daily Verse</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#e9d5ff;font-family:Arial,sans-serif;">${today}</p>
            </td>
          </tr>

          <!-- Verse -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:13px;letter-spacing:1px;color:#a78bfa;font-family:Arial,sans-serif;text-transform:uppercase;">${reference}</p>
              <blockquote style="margin:0;padding:0 0 0 20px;border-left:3px solid #7c3aed;">
                <p style="margin:0;font-size:20px;line-height:1.7;color:#f5f0ff;font-style:italic;">${verseText}</p>
              </blockquote>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a href="https://bibleforlifestages.com"
                 style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">
                Open App for Full Devotional
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2d1f4e;text-align:center;">
              <p style="margin:0;font-size:12px;color:#6b5b8a;font-family:Arial,sans-serif;">
                You're receiving this because you signed up for the Bible for Life Stages app.<br />
                <a href="https://bibleforlifestages.com/unsubscribe" style="color:#a78bfa;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  let sent = 0
  let errors = 0

  // Resend supports up to 50 recipients per call — batch if needed
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: batch,
        subject: `Today's Verse: ${reference}`,
        html,
      })
      if (error) {
        console.error('[Email] Resend error:', error)
        errors += batch.length
      } else {
        sent += batch.length
      }
    } catch (e) {
      console.error('[Email] Send error:', e)
      errors += batch.length
    }
  }

  console.log(`[Email] VOTD sent: ${sent}, errors: ${errors}`)
  return { sent, errors }
}
