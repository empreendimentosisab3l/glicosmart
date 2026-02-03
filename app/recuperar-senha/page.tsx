'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao solicitar recuperação')
            }

            setStatus('success')
            setMessage(data.message)
        } catch (error: any) {
            setStatus('error')
            setMessage(error.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-emerald-50 to-white">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Voltar para login
                    </Link>

                    <h1 className="text-2xl font-bold text-slate-800">Recuperar Senha</h1>
                    <p className="text-slate-500 mt-1">
                        Digite seu email para receber o link de redefinição.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Verifique seu email</h3>
                        <p className="text-slate-600 text-sm mb-6">{message}</p>
                        <Link
                            href="/login"
                            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200"
                        >
                            Voltar ao Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {message}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Link'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
