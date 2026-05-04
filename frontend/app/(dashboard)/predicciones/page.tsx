"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function PrediccionesPage() {
  const usersQuery = trpc.users.list.useQuery()
  const farmsQuery = trpc.farms.listAll.useQuery()
  const plotsQuery = trpc.plots.listAll.useQuery()
  const predictionsQuery = trpc.predictions.list.useQuery({ limit: 50 })
  const createUser = trpc.users.create.useMutation()
  const createFarm = trpc.farms.create.useMutation()
  const createPlot = trpc.plots.create.useMutation()
  const createPrediction = trpc.predictions.create.useMutation()

  const rows = predictionsQuery.data ?? []

  const ensurePlotId = async () => {
    const existingPlot = plotsQuery.data?.[0]
    if (existingPlot) return existingPlot.id

    const ownerId =
      usersQuery.data?.[0]?.id ??
      (await createUser.mutateAsync({
        firstName: 'Demo',
        lastName: 'Owner',
        email: `owner-${Date.now()}@demo.com`,
        password: 'demo1234',
      })).id

    const farmId =
      farmsQuery.data?.[0]?.id ??
      (await createFarm.mutateAsync({
        name: 'Predio predicciones',
        location: 'Cali, Valle del Cauca',
        area: 28,
        ownerId,
      })).id

    const createdPlot = await createPlot.mutateAsync({
      name: 'Lote modelo',
      area: 8,
      farmId,
    })

    await plotsQuery.refetch()
    return createdPlot.id
  }

  const handleGeneratePrediction = async () => {
    const plotId = await ensurePlotId()

    await createPrediction.mutateAsync({
      plotId,
      cropYield: 88.2,
      confidence: 0.93,
    })

    await predictionsQuery.refetch()
    window.alert('Se generó una predicción real en el backend')
  }

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
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={handleGeneratePrediction}>
            + Nueva prediccion
          </button>
        }
      >
        {predictionsQuery.isLoading || plotsQuery.isLoading || farmsQuery.isLoading || usersQuery.isLoading ? (
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
                {rows.map((prediction: any) => (
                  <tr key={prediction.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 text-sm">{prediction.plotId}</td>
                    <td className="px-4 py-3 text-sm">{prediction.cropYield.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm">{Math.round(prediction.confidence * 100)}%</td>
                    <td className="px-4 py-3 text-sm">{formatDate(prediction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay predicciones registradas.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
