"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function PrediccionesPage() {
  const { data = [], isLoading } = trpc.predictions.list.useQuery({ limit: 50 })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Analitica</p>
        <h1 className="text-3xl font-bold">Predicciones</h1>
      </div>

      <Panel
        title="Predicciones de rendimiento"
        description="Resultados recientes del modelo en lotes monitoreados."
        action={
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            + Nueva prediccion
          </button>
        }
      >
        {isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando predicciones...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lote</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rendimiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Confianza</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.map((prediction: any) => (
                  <tr key={prediction.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 text-sm">{prediction.plotId}</td>
                    <td className="px-4 py-3 text-sm">{prediction.cropYield.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm">{Math.round(prediction.confidence * 100)}%</td>
                    <td className="px-4 py-3 text-sm">{formatDate(prediction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay predicciones registradas.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
