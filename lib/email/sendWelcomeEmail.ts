import { Resend } from 'resend'
import { welcomeEmailHtml } from './templates/welcome'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(apiKey)
}

interface SendWelcomeEmailParams {
  to: string
  name: string | null
  password: string
}

export async function sendWelcomeEmail({ to, name, password }: SendWelcomeEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'GlicoSmart <onboarding@resend.dev>'

  const html = welcomeEmailHtml({
    name,
    email: to,
    password,
    loginUrl: `${baseUrl}/login`,
  })

  const { error } = await getResend().emails.send({
    from: fromEmail,
    to,
    subject: 'Bem-vindo ao GlicoSmart! Seus dados de acesso',
    html,
  })

  if (error) {
    console.error('Failed to send welcome email:', error)
    throw new Error(`Failed to send welcome email: ${error.message}`)
  }
}
