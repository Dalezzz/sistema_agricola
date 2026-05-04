import type { ReactNode } from 'react'
import LogoutButton from '@/components/auth/LogoutButton'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Predios', href: '/predios' },
    { label: 'Lotes', href: '/lotes' },
    { label: 'Cultivos', href: '/cultivos' },
    { label: 'Sensores', href: '/sensores' },
    { label: 'Riego', href: '/riego' },
    { label: 'Predicciones', href: '/predicciones' },
    { label: 'Reportes', href: '/reportes' },
    { label: 'Clima', href: '/clima' },
    { label: 'Usuarios', href: '/usuarios' },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="hidden md:flex md:flex-col md:w-72 md:py-8 md:px-6">
        <div className="rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400/20 border border-emerald-200/20 flex items-center justify-center">
              <span className="text-lg font-semibold">SA</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Sistema</p>
              <h1 className="text-2xl font-semibold">SisAg</h1>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-4 py-2 text-emerald-100/90 hover:bg-emerald-700/40 hover:text-white transition"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-emerald-200/60">→</span>
              </a>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-emerald-700/40 p-4 text-xs text-emerald-100">
            Panel operativo para predios, lotes y monitoreo en tiempo real.
          </div>
          <div className="mt-6">
            <LogoutButton
              className="w-full rounded-full border border-emerald-200/40 px-4 py-2 text-xs font-semibold text-emerald-100/90 hover:bg-emerald-700/50"
            />
          </div>
        </div>
      </aside>

      <header className="md:hidden px-5 pt-6">
        <div className="panel rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">SisAg</p>
              <h1 className="text-lg font-semibold">Centro de control</h1>
            </div>
            <span className="text-sm text-[color:var(--accent)]">● Online</span>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-emerald-200/40 px-4 py-1 text-xs font-medium text-[color:var(--ink-soft)]"
              >
                {item.label}
              </a>
            ))}
            <LogoutButton
              className="shrink-0 rounded-full border border-emerald-200/40 px-4 py-1 text-xs font-semibold text-[color:var(--ink-soft)]"
              label="Salir"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 page-enter">
        {children}
      </main>
    </div>
  )
}
