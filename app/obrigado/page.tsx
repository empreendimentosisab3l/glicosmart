'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Laptop, Loader2, Lock } from 'lucide-react'

function ThankYouContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const emailFromUrl = searchParams.get('email')
        if (emailFromUrl) {
            setEmail(emailFromUrl)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch('/api/auth/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao ativar conta')
            }

            // Success - Redirect to Dashboard
            // Small delay for UX
            setTimeout(() => {
                router.push('/quiz')
            }, 1000)

        } catch (err: any) {
            setError(err.message)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">



                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-emerald-200 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Seu pedido foi confirmado!</h2>
                        <p className="text-emerald-50 opacity-90">
                            Obrigado pela confiança. Enviamos um email com os detalhes da sua compra.
                        </p>
                    </div>
                </div>

                {/* Activation Form with Mockup */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 pb-0 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ative seu acesso agora</h2>
                        <p className="text-slate-500 mb-8">Crie uma senha para acessar sua área de membros</p>

                        {/* Laptop Mockup Placeholder - using generic div structure to mimic the requested style if image fails, but trying to use the image if meaningful */}
                        {/* Since the user provided a local path to an image, I cannot directly import it in Next.js without it being in public. 
                I will use a placeholder or assume the user wants the structure. 
                I'll use a CSS-only laptop mockup for now to be safe, or a generic placeholder.
            */}
                        <div className="relative mx-auto w-full max-w-sm mb-8">
                            <div className="bg-slate-800 rounded-t-xl p-2 pb-0 mx-auto w-64 md:w-80">
                                <div className="bg-emerald-900 aspect-video rounded-t-lg opacity-80 flex items-center justify-center">
                                    <Laptop className="text-emerald-500/50 w-12 h-12" />
                                </div>
                            </div>
                            <div className="bg-slate-300 h-3 rounded-b-xl mx-auto w-72 md:w-96"></div>
                        </div>
                    </div>

                    <div className="p-8 pt-0 max-w-md mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email de acesso</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Crie sua senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirme a senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Digite novamente"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 active:scale-95 flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Lock className="w-5 h-5" />
                                )}
                                {isSubmitting ? 'Ativando...' : 'Acessar Plataforma'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    )
}
