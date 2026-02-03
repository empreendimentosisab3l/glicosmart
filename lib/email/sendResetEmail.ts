import { Resend } from 'resend'
import { resetPasswordEmailHtml } from './templates/reset-password'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(apiKey)
}

interface SendResetEmailParams {
  to: string
  name: string | null
  resetToken: string
}

export async function sendResetEmail({ to, name, resetToken }: SendResetEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'GlicoSmart <onboarding@resend.dev>'

  const html = resetPasswordEmailHtml({
    name,
    resetUrl: `${baseUrl}/redefinir-senha?token=${resetToken}`,
  })

  const { error } = await getResend().emails.send({
    from: fromEmail,
    to,
    subject: 'GlicoSmart — Redefinir sua senha',
    html,
  })

  if (error) {
    console.error('Failed to send reset email:', error)
    throw new Error(`Failed to send reset email: ${error.message}`)
  }
}
