import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail'
import crypto from 'crypto'

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString('base64url')
}

export async function POST(request: NextRequest) {
  try {
    // Validar secret key
    const webhookSecret = process.env.PAYT_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('PAYT_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const body = await request.json()

    // Validar access key (Payt envia no body ou header)
    const accessKey =
      request.headers.get('x-payt-secret') ||
      body.access_key ||
      body.accessKey

    if (accessKey !== webhookSecret) {
      console.error('Invalid webhook access key')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extrair dados do payload Payt
    const event = body.event || body.tipo_evento || body.type
    const email = (
      body.email ||
      body.cliente?.email ||
      body.customer?.email ||
      ''
    ).toLowerCase().trim()
    const name =
      body.name ||
      body.nome ||
      body.cliente?.nome ||
      body.customer?.name ||
      null
    const amount =
      body.amount ||
      body.valor ||
      body.transaction?.amount ||
      null
    const plan =
      body.plan ||
      body.plano ||
      'standard'

    if (!email) {
      console.error('Webhook received without email:', body)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Salvar log do pagamento
    await prisma.paymentLog.create({
      data: {
        email,
        event: event || 'unknown',
        amount: amount ? parseFloat(String(amount)) : null,
        plan,
        paytPayload: body,
      },
    })

    // Processar evento
    switch (event?.toLowerCase()) {
      case 'venda':
      case 'sale':
      case 'subscription':
      case 'recorrência':
      case 'recorrencia': {
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

        // Enviar email de boas-vindas com senha temporária
        try {
          await sendWelcomeEmail({
            to: email,
            name,
            password: tempPassword,
          })
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
          // Não falhar o webhook por causa do email
        }

        return NextResponse.json({
          success: true,
          action: 'user_created',
          email,
        })
      }

      case 'cancelamento':
      case 'cancellation':
      case 'reembolso':
      case 'refund': {
        await prisma.user.updateMany({
          where: { email },
          data: {
            status: 'inactive',
            planExpiresAt: new Date(),
          },
        })

        return NextResponse.json({
          success: true,
          action: 'user_deactivated',
          email,
        })
      }

      default: {
        console.warn('Unknown webhook event:', event)
        return NextResponse.json({
          success: true,
          action: 'event_logged',
          event,
        })
      }
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
