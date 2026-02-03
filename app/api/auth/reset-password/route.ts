import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { sendResetEmail } from '@/lib/email/sendResetEmail'
import { z } from 'zod'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const requestResetSchema = z.object({
  email: z.string().email('Email inválido'),
})

const confirmResetSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

// POST /api/auth/reset-password — solicitar reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = requestResetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Sempre retornar sucesso para não revelar se o email existe
    if (!user) {
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
      })
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    // Enviar email
    try {
      await sendResetEmail({
        to: user.email,
        name: user.name,
        resetToken,
      })
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      return NextResponse.json(
        { error: 'Erro ao enviar email. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
    })
  } catch (error) {
    console.error('Reset password request error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/auth/reset-password — confirmar nova senha
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = confirmResetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado. Solicite um novo link.' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({
      message: 'Senha alterada com sucesso. Faça login com sua nova senha.',
    })
  } catch (error) {
    console.error('Reset password confirm error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
