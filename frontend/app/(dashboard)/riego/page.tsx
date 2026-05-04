"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function RiegoPage() {
  const { data = [], isLoading } = trpc.irrigation.listAll.useQuery({ limit: 50 })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Recursos</p>
        <h1 className="text-3xl font-bold">Riego</h1>
      </div>

      <Panel
        title="Eventos de riego"
        description="Historico de riegos registrados por lote."
        action={
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            + Registrar evento
          </button>
        }
      >
        {isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando riegos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lote</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Duracion</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Agua usada</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.map((event: any) => (
                  <tr key={event.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 text-sm">{event.plotId}</td>
                    <td className="px-4 py-3 text-sm">{event.duration} min</td>
                    <td className="px-4 py-3 text-sm">{event.waterUsed} L</td>
                    <td className="px-4 py-3 text-sm">{formatDate(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay eventos de riego.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
