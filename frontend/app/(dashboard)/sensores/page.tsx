"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

const getLatestReading = (readings?: any[]) => {
  if (!readings?.length) return null
  return readings.reduce((latest, current) => {
    if (!latest) return current
    return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  }, readings[0])
}

export default function SensoresPage() {
  const { data = [], isLoading } = trpc.sensors.listAll.useQuery()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Monitoreo</p>
        <h1 className="text-3xl font-bold">Sensores</h1>
      </div>

      <Panel
        title="Sensores activos"
        description="Ultimas lecturas y ubicacion en predios/lotes."
        action={
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            + Nuevo sensor
          </button>
        }
      >
        {isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando sensores...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Predio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lote</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ultima lectura</th>
                </tr>
              </thead>
              <tbody>
                {data.map((sensor: any) => {
                  const latest = getLatestReading(sensor.readings)
                  return (
                    <tr key={sensor.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                      <td className="px-4 py-3 font-medium">{sensor.name}</td>
                      <td className="px-4 py-3 text-sm text-[color:var(--ink-soft)]">{sensor.type}</td>
                      <td className="px-4 py-3 text-sm">{sensor.farmId}</td>
                      <td className="px-4 py-3 text-sm">{sensor.plotId || 'N/D'}</td>
                      <td className="px-4 py-3 text-sm">
                        {latest ? `${latest.value} ${latest.unit} (${formatDate(latest.createdAt)})` : 'Sin datos'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!data.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay sensores registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
