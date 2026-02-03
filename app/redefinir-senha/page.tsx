'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Loader2, CheckCircle } from 'lucide-react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus('error')
            setMessage('As senhas não coincidem')
            return
        }

        if (!token) {
            setStatus('error')
            setMessage('Token inválido ou ausente')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao redefinir senha')
            }

            setStatus('success')
            setMessage(data.message)

            // Redirect after delay
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error: any) {
            setStatus('error')
            setMessage(error.message)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
                    Link inválido ou expirado.
                </div>
                <Link href="/recuperar-senha" className="text-emerald-600 font-bold hover:underline">
                    Solicitar novo link
                </Link>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Senha Alterada!</h3>
                <p className="text-slate-600 text-sm mb-6">{message}</p>
                <p className="text-sm text-slate-500">Redirecionando para login...</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {message}
                </div>
            )}

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Nova Senha
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirmar Senha
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme a nova senha"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 pr-12"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Salvando...
                    </>
                ) : (
                    <>
                        <Lock size={20} />
                        Redefinir Senha
                    </>
                )}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-emerald-50 to-white">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Redefinir Senha</h1>
                    <p className="text-slate-500 mt-1">
                        Crie uma nova senha segura.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center text-slate-400">Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
