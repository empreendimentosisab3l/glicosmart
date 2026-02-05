'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInIframe, setIsInIframe] = useState(false)

  const redirect = searchParams.get('redirect') || '/dashboard'

  // Detecta se está em iframe
  useEffect(() => {
    try {
      if (window.self !== window.top) {
        setIsInIframe(true)
      }
    } catch (e) {
      setIsInIframe(true)
    }
  }, [])

  // Função para sair do iframe
  const handleExitIframe = () => {
    window.open(window.location.href, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Pequeno delay para garantir que o cookie seja processado pelo navegador
      await new Promise(resolve => setTimeout(resolve, 100))
      window.location.href = redirect
    }
  }

  // Se está em iframe, mostra botão para abrir em nova aba
  if (isInIframe) {
    return (
      <div className="text-center">
        <p className="text-slate-500 mb-4">
          Para fazer login, clique no botão abaixo.
        </p>
        <button
          onClick={handleExitIframe}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
        >
          <LogIn size={20} />
          Abrir Página de Login
        </button>
        <p className="text-xs text-slate-400 mt-3">
          Uma nova aba será aberta.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
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
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            autoComplete="current-password"
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
        <div className="flex justify-end mt-2">
          <Link
            href="/recuperar-senha"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <LogIn size={20} />
        )}
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form >
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <span className="text-white text-2xl font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">GlicoSmart</h1>
          <p className="text-slate-500 mt-1">Entre na sua conta</p>
        </div>

        <Suspense fallback={<div className="text-center text-slate-400">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
