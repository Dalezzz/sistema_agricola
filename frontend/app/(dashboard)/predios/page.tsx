"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function PrediosPage() {
  const usersQuery = trpc.users.list.useQuery()
  const farmsQuery = trpc.farms.listAll.useQuery()
  const createUser = trpc.users.create.useMutation()
  const createFarm = trpc.farms.create.useMutation()

  const rows = farmsQuery.data ?? []

  const ensureOwnerId = async () => {
    const existingOwner = usersQuery.data?.[0]

    if (existingOwner) {
      return existingOwner.id
    }

    const createdOwner = await createUser.mutateAsync({
      firstName: 'Demo',
      lastName: 'Owner',
      email: `owner-${Date.now()}@demo.com`,
      password: 'demo1234',
    })

    await usersQuery.refetch()
    return createdOwner.id
  }

  const handleAddFarm = async () => {
    const ownerId = await ensureOwnerId()
    const nextIndex = rows.length + 1

    await createFarm.mutateAsync({
      name: `Predio de ejemplo ${nextIndex}`,
      location: 'Cali, Valle del Cauca',
      area: 24 + nextIndex,
      ownerId,
    })

    await farmsQuery.refetch()
    window.alert(`Se agregó el predio de ejemplo ${nextIndex} en el backend`)
  }

  const handleSeedFarms = async () => {
    const ownerId = await ensureOwnerId()

    await createFarm.mutateAsync({
      name: 'Predio San Miguel',
      location: 'Tuluá, Valle del Cauca',
      area: 48,
      ownerId,
    })
    await createFarm.mutateAsync({
      name: 'Finca El Oasis',
      location: 'Palmira, Valle del Cauca',
      area: 31,
      ownerId,
    })

    await farmsQuery.refetch()
    window.alert('Se cargaron dos predios de ejemplo en el backend')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Territorio</p>
        <h1 className="text-3xl font-bold">Predios</h1>
      </div>

      <Panel
        title="Predios registrados"
        description="Supervision de ubicaciones y capacidad productiva."
        action={
          <div className="flex gap-2">
            <button className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50" onClick={handleSeedFarms}>
              Cargar ejemplos
            </button>
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={handleAddFarm}>
              + Nuevo predio
            </button>
          </div>
        }
      >
        {farmsQuery.isLoading || usersQuery.isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando predios...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ubicacion</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Area</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lotes</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sensores</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Creado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((farm: any) => (
                  <tr key={farm.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 font-medium">{farm.name}</td>
                    <td className="px-4 py-3 text-sm text-[color:var(--ink-soft)]">{farm.location}</td>
                    <td className="px-4 py-3 text-sm">{farm.area} ha</td>
                    <td className="px-4 py-3 text-sm">{farm.plots?.length ?? 0}</td>
                    <td className="px-4 py-3 text-sm">{farm.sensors?.length ?? 0}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(farm.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay predios registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
