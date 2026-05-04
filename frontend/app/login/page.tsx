"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loginMutation = trpc.auth.login.useMutation()
  const meQuery = trpc.auth.me.useQuery()

  useEffect(() => {
    if (meQuery.data?.user) {
      router.replace('/dashboard')
    }
  }, [meQuery.data?.user, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      })

      if (!result.user) {
        setError('Credenciales invalidas. Verifica tu correo y contraseña.')
        return
      }

      if (result.access_token) {
        const maxAge = 7 * 24 * 60 * 60
        document.cookie = `access_token=${result.access_token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
      }

      router.replace('/dashboard')
    } catch {
      setError('No se pudo iniciar sesion. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Sistema Agricola</p>
          <h1 className="text-3xl font-bold text-emerald-900">Iniciar sesion</h1>
          <p className="text-sm text-emerald-700/80">Accede al panel con tus credenciales.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-900" htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-emerald-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@empresa.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-900" htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-emerald-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contrasena"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
