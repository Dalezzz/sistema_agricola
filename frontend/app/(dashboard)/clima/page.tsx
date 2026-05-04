"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function ClimaPage() {
  const weatherQuery = trpc.weather.list.useQuery({ limit: 50 })
  const createWeather = trpc.weather.create.useMutation()
  const rows = weatherQuery.data ?? []

  const handleAddWeather = async () => {
    await createWeather.mutateAsync({
      temperature: 28,
      humidity: 58,
      precipitation: 2,
      windSpeed: 10,
    })
    await weatherQuery.refetch()
    window.alert('Se agregó una lectura climática real en el backend')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Ambiental</p>
        <h1 className="text-3xl font-bold">Clima</h1>
      </div>

      <Panel
        title="Registros climaticos"
        description="Datos recibidos desde la ingesta automatizada."
        action={
          <button
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={handleAddWeather}
          >
            + Registrar lectura
          </button>
        }
      >
        {weatherQuery.isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando clima...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Temperatura</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Humedad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Precipitacion</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Viento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any) => (
                  <tr key={row.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 text-sm">{row.temperature} C</td>
                    <td className="px-4 py-3 text-sm">{row.humidity}%</td>
                    <td className="px-4 py-3 text-sm">{row.precipitation} mm</td>
                    <td className="px-4 py-3 text-sm">{row.windSpeed} km/h</td>
                    <td className="px-4 py-3 text-sm">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay registros climaticos.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
