interface WelcomeEmailProps {
  name: string | null
  email: string
  password: string
  loginUrl: string
}

export function welcomeEmailHtml({ name, email, password, loginUrl }: WelcomeEmailProps): string {
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
              <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="color:#fff;font-size:24px;font-weight:bold;">G</span>
              </div>
              <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Bem-vindo ao GlicoSmart!</h1>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0;">Seu plano alimentar personalizado</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Olá <strong>${displayName}</strong>,
              </p>
              <p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Sua conta no GlicoSmart foi criada com sucesso! Aqui estão seus dados de acesso:
              </p>

              <!-- Credentials Box -->
              <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="color:#334155;font-size:14px;margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
                <p style="color:#334155;font-size:14px;margin:0;"><strong>Senha:</strong> ${password}</p>
              </div>

              <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0 0 24px;">
                Recomendamos que você altere sua senha após o primeiro login.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display:inline-block;background-color:#10b981;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">
                      Acessar Meu Plano
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
                <p style="color:#334155;font-size:14px;font-weight:600;margin:0 0 12px;">O que você tem acesso:</p>
                <p style="color:#64748b;font-size:14px;margin:0 0 6px;">&#10003; Plano alimentar semanal personalizado</p>
                <p style="color:#64748b;font-size:14px;margin:0 0 6px;">&#10003; 525+ receitas para diabéticos</p>
                <p style="color:#64748b;font-size:14px;margin:0 0 6px;">&#10003; Banco de alimentos com índice glicêmico</p>
                <p style="color:#64748b;font-size:14px;margin:0 0 6px;">&#10003; Simulador de glicose</p>
                <p style="color:#64748b;font-size:14px;margin:0;">&#10003; Lista de compras automática</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                GlicoSmart — Seu Plano Alimentar Inteligente<br>
                Este email foi enviado porque você adquiriu o plano GlicoSmart.
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
