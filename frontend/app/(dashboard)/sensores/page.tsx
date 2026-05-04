"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

type SensorRow = {
  id: string
  name: string
  type: string
  farm: string
  plot: string
  latestReading: string
}

export default function SensoresPage() {
  const usersQuery = trpc.users.list.useQuery()
  const farmsQuery = trpc.farms.listAll.useQuery()
  const plotsQuery = trpc.plots.listAll.useQuery()
  const sensorsQuery = trpc.sensors.listAll.useQuery()
  const createUser = trpc.users.create.useMutation()
  const createFarm = trpc.farms.create.useMutation()
  const createSensor = trpc.sensors.create.useMutation()
  const addReading = trpc.sensors.addReading.useMutation()

  const rows: SensorRow[] = (sensorsQuery.data ?? []).map((sensor: any) => {
    const latestReading = [...(sensor.readings ?? [])].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )[0]

    return {
      id: sensor.id,
      name: sensor.name,
      type: sensor.type,
      farm: sensor.farmId,
      plot: sensor.plotId || 'N/D',
      latestReading: latestReading
        ? `${latestReading.value} ${latestReading.unit} (${formatDate(latestReading.createdAt)})`
        : 'Sin datos',
    }
  })

  const ensureFarmId = async () => {
    const existingFarm = farmsQuery.data?.[0]
    if (existingFarm) return existingFarm.id

    const existingOwner = usersQuery.data?.[0]
    const ownerId =
      existingOwner?.id ??
      (await createUser.mutateAsync({
        firstName: 'Demo',
        lastName: 'Owner',
        email: `owner-${Date.now()}@demo.com`,
        password: 'demo1234',
      })).id

    const createdFarm = await createFarm.mutateAsync({
      name: 'Predio sensores',
      location: 'Cali, Valle del Cauca',
      area: 22,
      ownerId,
    })

    await farmsQuery.refetch()
    return createdFarm.id
  }

  const handleAddSensor = async () => {
    const farmId = await ensureFarmId()
    const plotId = plotsQuery.data?.[0]?.id

    const createdSensor = await createSensor.mutateAsync({
      name: `Sensor de ejemplo ${rows.length + 1}`,
      type: 'Humedad',
      farmId,
      ...(plotId ? { plotId } : {}),
    })

    await addReading.mutateAsync({
      sensorId: createdSensor.id,
      value: 64,
      unit: '%',
    })

    await sensorsQuery.refetch()
    window.alert(`Se agregó ${createdSensor.name} en el backend`)
  }

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
          <button
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={handleAddSensor}
          >
            + Nuevo sensor
          </button>
        }
      >
        {sensorsQuery.isLoading || farmsQuery.isLoading || plotsQuery.isLoading || usersQuery.isLoading ? (
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
                {rows.map((sensor) => (
                  <tr key={sensor.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 font-medium">{sensor.name}</td>
                    <td className="px-4 py-3 text-sm text-[color:var(--ink-soft)]">{sensor.type}</td>
                    <td className="px-4 py-3 text-sm">{sensor.farm}</td>
                    <td className="px-4 py-3 text-sm">{sensor.plot}</td>
                    <td className="px-4 py-3 text-sm">{sensor.latestReading}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay sensores registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
