import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@ghanasevents.com'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'GhanasEvent'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ghanasevents.com'

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

// Supabase calls this hook with a JSON body containing email_data
// https://supabase.com/docs/guides/auth/auth-hooks#send-email-hook
export async function POST(req: NextRequest) {
  // Verify the request comes from Supabase using a shared secret
  const authHeader = req.headers.get('authorization')
  const expected = `Bearer ${process.env.SUPABASE_HOOK_SECRET}`
  if (!process.env.SUPABASE_HOOK_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { user, email_data } = body as {
    user: { email: string }
    email_data: {
      token: string
      token_hash: string
      redirect_to: string
      email_action_type: string
      site_url: string
    }
  }

  const { email_action_type, token_hash, redirect_to } = email_data
  const confirmUrl = `${APP_URL}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&next=${encodeURIComponent(redirect_to ?? '/')}`

  let subject = ''
  let html = ''

  if (email_action_type === 'recovery') {
    subject = `Reset your ${APP_NAME} password`
    html = passwordResetHtml(user.email, confirmUrl)
  } else if (email_action_type === 'signup') {
    subject = `Confirm your ${APP_NAME} account`
    html = confirmSignupHtml(user.email, confirmUrl)
  } else if (email_action_type === 'magiclink') {
    subject = `Your ${APP_NAME} sign-in link`
    html = magicLinkHtml(user.email, confirmUrl)
  } else if (email_action_type === 'email_change') {
    subject = `Confirm your new email on ${APP_NAME}`
    html = emailChangeHtml(user.email, confirmUrl)
  } else {
    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
  }

  const resend = getResend()
  if (!resend) {
    console.error('[send-email hook] RESEND_API_KEY is not configured')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  const { error } = await resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: user.email,
    subject,
    html,
  })

  if (error) {
    console.error('[send-email hook]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'OK' })
}

// ─── Email templates ─────────────────────────────────────────────────────────

function base(preheader: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1c1c3a;padding:28px 40px;text-align:center;">
            <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              GHANAS<span style="color:#C9973A;">EVENT</span>
              <span style="background:#C9973A;color:#fff;font-size:10px;font-weight:700;padding:1px 4px;border-radius:3px;vertical-align:super;margin-left:2px;">.com</span>
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f7f4;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} GhanasEvent.com · Ghana's premier events platform<br/>
              <a href="${APP_URL}" style="color:#C9973A;text-decoration:none;">${APP_URL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(href: string, label: string) {
  return `<a href="${href}"
    style="display:inline-block;background:#C9973A;color:#ffffff;font-size:15px;font-weight:700;
           text-decoration:none;padding:14px 32px;border-radius:8px;margin:24px 0;">
    ${label}
  </a>`
}

function passwordResetHtml(email: string, url: string) {
  return base('Reset your GhanasEvent password', `
    <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Reset your password</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
      We received a request to reset the password for <strong>${email}</strong>.
      Click the button below to choose a new password.
    </p>
    ${btn(url, 'Reset password')}
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>`)
}

function confirmSignupHtml(email: string, url: string) {
  return base('Confirm your GhanasEvent account', `
    <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Welcome to GhanasEvent! 🎉</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
      Thanks for signing up with <strong>${email}</strong>.
      Confirm your email address to start discovering and booking the best events across Ghana.
    </p>
    ${btn(url, 'Confirm my account')}
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      If you didn't create an account, you can ignore this email.
    </p>`)
}

function magicLinkHtml(email: string, url: string) {
  return base('Your GhanasEvent sign-in link', `
    <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Sign in to GhanasEvent</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
      Click the button below to sign in as <strong>${email}</strong>.
      This link is single-use and expires in 1 hour.
    </p>
    ${btn(url, 'Sign in')}
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      If you didn't request this, you can safely ignore it.
    </p>`)
}

function emailChangeHtml(email: string, url: string) {
  return base('Confirm your new email on GhanasEvent', `
    <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Confirm your new email</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
      We received a request to change the email on your account to <strong>${email}</strong>.
      Click below to confirm the change.
    </p>
    ${btn(url, 'Confirm email change')}
    <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
      If you didn't request this change, please contact us immediately.
    </p>`)
}
