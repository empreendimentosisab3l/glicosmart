import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import { z } from 'zod'

const activateSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const parsed = activateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            )
        }

        const { email, password } = parsed.data

        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        const hashedPassword = await hashPassword(password)

        if (user) {
            // User exists (e.g. from Webhook), just set password and activate
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    // If needed, we can update status here, but usually webhook handles it.
                    // Let's ensure name is not null if we want, but for now just password.
                },
            })
        } else {
            // User doesn't exist (Direct access?), create new one
            user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    status: 'active', // Default to active for direct signups here? Or pending? 
                    // Plan assumes "Welcome flow", so likely active.
                    plan: 'free',     // Default plan
                },
            })
        }

        // Auto-login
        await createSession({ userId: user.id, email: user.email })

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            message: 'Conta ativada com sucesso',
        })
    } catch (error) {
        console.error('Activation error:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
