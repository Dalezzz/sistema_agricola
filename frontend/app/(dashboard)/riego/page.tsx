"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function RiegoPage() {
  const usersQuery = trpc.users.list.useQuery()
  const farmsQuery = trpc.farms.listAll.useQuery()
  const plotsQuery = trpc.plots.listAll.useQuery()
  const irrigationQuery = trpc.irrigation.listAll.useQuery({ limit: 50 })
  const createUser = trpc.users.create.useMutation()
  const createFarm = trpc.farms.create.useMutation()
  const createPlot = trpc.plots.create.useMutation()
  const recordIrrigation = trpc.irrigation.record.useMutation()

  const rows = irrigationQuery.data ?? []

  const ensurePlotId = async () => {
    const existingPlot = plotsQuery.data?.[0]
    if (existingPlot) return existingPlot.id

    const existingFarm = farmsQuery.data?.[0]
    const ownerId =
      usersQuery.data?.[0]?.id ??
      (await createUser.mutateAsync({
        firstName: 'Demo',
        lastName: 'Owner',
        email: `owner-${Date.now()}@demo.com`,
        password: 'demo1234',
      })).id

    const farmId =
      existingFarm?.id ??
      (await createFarm.mutateAsync({
        name: 'Predio riego',
        location: 'Cali, Valle del Cauca',
        area: 26,
        ownerId,
      })).id

    const createdPlot = await createPlot.mutateAsync({
      name: 'Lote riego base',
      area: 6,
      farmId,
    })

    await plotsQuery.refetch()
    return createdPlot.id
  }

  const handleAddEvent = async () => {
    const plotId = await ensurePlotId()

    await recordIrrigation.mutateAsync({
      plotId,
      duration: 35,
      waterUsed: 940,
    })

    await irrigationQuery.refetch()
    window.alert('Se agregó un evento de riego real en el backend')
  }

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
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={handleAddEvent}>
            + Registrar evento
          </button>
        }
      >
        {irrigationQuery.isLoading || plotsQuery.isLoading || farmsQuery.isLoading || usersQuery.isLoading ? (
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
                {rows.map((event: any) => (
                  <tr key={event.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 text-sm">{event.plotId}</td>
                    <td className="px-4 py-3 text-sm">{event.duration} min</td>
                    <td className="px-4 py-3 text-sm">{event.waterUsed} L</td>
                    <td className="px-4 py-3 text-sm">{formatDate(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay eventos de riego.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
