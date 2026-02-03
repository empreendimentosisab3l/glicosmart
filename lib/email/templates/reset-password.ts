interface ResetPasswordEmailProps {
  name: string | null
  resetUrl: string
}

export function resetPasswordEmailHtml({ name, resetUrl }: ResetPasswordEmailProps): string {
  const displayName = name || 'você'

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981, #059669);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Redefinir Senha</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Olá <strong>${displayName}</strong>,
              </p>
              <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Recebemos uma solicitação para redefinir sua senha do GlicoSmart. Clique no botão abaixo para criar uma nova senha:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display:inline-block;background-color:#10b981;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#64748b;font-size:13px;line-height:1.5;margin:24px 0 0;">
                Este link expira em <strong>1 hora</strong>. Se você não solicitou a redefinição, ignore este email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                GlicoSmart — Seu Plano Alimentar Inteligente
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
