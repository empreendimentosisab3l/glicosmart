import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// Chave de acesso Payt (configurada no postback)
const PAYT_ACCESS_KEY = process.env.PAYT_WEBHOOK_SECRET || ''

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString('base64url')
}

function validatePaytKey(requestKey: string): boolean {
  return requestKey === PAYT_ACCESS_KEY
}

// Endpoint para testar (GET)
export async function GET() {
  return NextResponse.json({
    status: 'Webhook Payt ativo',
    provider: 'Payt',
    app: 'GlicoSmart',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhook/payt'
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // LOG COMPLETO para debug
    console.log('📩 PAYLOAD COMPLETO RECEBIDO DA PAYT:', JSON.stringify(data, null, 2))

    // Validar chave de acesso se enviada (compatível com Payt)
    if (data.access_key && !validatePaytKey(data.access_key)) {
      console.error('❌ Chave de acesso inválida')
      return NextResponse.json({
        error: 'Invalid access key'
      }, { status: 401 })
    }

    // Extrair dados do payload Payt (múltiplos formatos)
    const email = (
      data.customer_email ||
      data.email ||
      data.cliente?.email ||
      data.customer?.email ||
      ''
    ).toLowerCase().trim()

    const name =
      data.customer_name ||
      data.name ||
      data.nome ||
      data.cliente?.nome ||
      data.customer?.name ||
      null

    const eventType = data.event || data.status || data.tipo_evento || data.type

    const amount =
      data.amount ||
      data.valor ||
      data.transaction?.amount ||
      null

    const plan =
      data.product_name ||
      data.offer_name ||
      data.prod_name ||
      data.plan ||
      data.plano ||
      'standard'

    // Se não tiver email, é provavelmente um teste da Payt
    if (!email) {
      console.log('⚠️ Webhook recebido sem email - provavelmente teste da Payt')
      return NextResponse.json({
        success: true,
        message: 'Webhook test received - no email provided',
        note: 'This is OK for Payt URL test button'
      })
    }

    // Salvar log do pagamento
    try {
      await prisma.paymentLog.create({
        data: {
          email,
          event: eventType || 'unknown',
          amount: amount ? parseFloat(String(amount)) : null,
          plan,
          paytPayload: data,
        },
      })
    } catch (logError) {
      console.error('Erro ao salvar log:', logError)
      // Continua mesmo se falhar o log
    }

    // =============================================================================
    // EVENTOS QUE LIBERAM ACESSO
    // =============================================================================
    const eventosLiberacao = [
      'Venda',
      'venda',
      'sale',
      'Recorrência',
      'recorrencia',
      'subscription',
      'Assinatura Reativada',
      'Pedido Confirmado',
      'Aguardando Confirmação',
      'Assinatura Renovada',
      'Assinatura Ativada'
    ]

    if (eventosLiberacao.includes(eventType)) {
      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        // Atualizar plano do usuário existente
        await prisma.user.update({
          where: { email },
          data: {
            plan,
            status: 'active',
            paidAt: new Date(),
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
          },
        })

        console.log('✅ Usuário atualizado:', email)
        return NextResponse.json({
          success: true,
          action: 'user_updated',
          email,
        })
      }

      // Criar novo usuário com senha temporária
      const tempPassword = generateTempPassword()
      const hashedPassword = await hashPassword(tempPassword)

      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          plan,
          status: 'active',
          paidAt: new Date(),
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      console.log('✅ Novo usuário criado:', email)

      // Enviar email de boas-vindas com senha temporária
      try {
        await sendWelcomeEmail({
          to: email,
          name,
          password: tempPassword,
        })
        console.log('📨 Email de boas-vindas enviado!')
      } catch (emailError) {
        console.error('⚠️ Erro ao enviar email:', emailError)
        // Não falhar o webhook por causa do email
      }

      return NextResponse.json({
        success: true,
        action: 'user_created',
        email,
      })
    }

    // =============================================================================
    // EVENTOS QUE REMOVEM ACESSO
    // =============================================================================
    const eventosRemocao = [
      'cancelamento',
      'cancellation',
      'Assinatura Cancelada',
      'Pedido Frustrado',
      'Venda Cancelada',
      'reembolso',
      'refund',
      'Reembolso',
      'Chargeback',
      'Disputa',
      'Devolvida',
      'Reembolsada'
    ]

    if (eventosRemocao.includes(eventType)) {
      await prisma.user.updateMany({
        where: { email },
        data: {
          status: 'inactive',
          planExpiresAt: new Date(),
        },
      })

      console.log('❌ Acesso removido para:', email)
      return NextResponse.json({
        success: true,
        action: 'user_deactivated',
        email,
      })
    }

    // =============================================================================
    // OUTROS EVENTOS
    // =============================================================================
    if (eventType === 'Assinatura em Atraso') {
      console.log('⚠️ Assinatura em atraso:', email)
      return NextResponse.json({
        success: true,
        message: 'Assinatura em atraso notificada'
      })
    }

    // Evento não reconhecido - apenas loga
    console.log('ℹ️ Evento Payt não tratado:', eventType)
    return NextResponse.json({
      success: true,
      action: 'event_logged',
      event: eventType,
    })

  } catch (error) {
    console.error('❌ Erro no webhook Payt:', error)
    return NextResponse.json({
      error: 'Internal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
