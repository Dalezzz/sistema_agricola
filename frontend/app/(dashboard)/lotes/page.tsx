"use client"

import LoteTable from '@/components/lotes/LoteTable'
import { trpc } from '@/lib/trpc/react'

type LoteDisplayRow = {
  id: string
  nombre: string
  cultivo?: string | null
  area?: string | null
  estado?: string | null
}

export default function LotesPage() {
  const usersQuery = trpc.users.list.useQuery()
  const farmsQuery = trpc.farms.listAll.useQuery()
  const cropsQuery = trpc.crops.list.useQuery()
  const plotsQuery = trpc.plots.listAll.useQuery()
  const createUser = trpc.users.create.useMutation()
  const createFarm = trpc.farms.create.useMutation()
  const createCrop = trpc.crops.create.useMutation()
  const createPlot = trpc.plots.create.useMutation()
  const updatePlot = trpc.plots.update.useMutation()
  const removePlot = trpc.plots.remove.useMutation()

  const rows = (plotsQuery.data ?? []).map((plot: any) => ({
    id: plot.id,
    nombre: plot.name,
    cultivo: plot.crop?.name ?? null,
    area: `${plot.area} ha`,
    estado: 'Activo',
  }))

  const ensureOwnerId = async () => {
    const existingOwner = usersQuery.data?.[0]
    if (existingOwner) return existingOwner.id

    const createdOwner = await createUser.mutateAsync({
      firstName: 'Demo',
      lastName: 'Owner',
      email: `owner-${Date.now()}@demo.com`,
      password: 'demo1234',
    })

    await usersQuery.refetch()
    return createdOwner.id
  }

  const ensureFarmId = async () => {
    const existingFarm = farmsQuery.data?.[0]
    if (existingFarm) return existingFarm.id

    const ownerId = await ensureOwnerId()
    const createdFarm = await createFarm.mutateAsync({
      name: 'Predio base',
      location: 'Cali, Valle del Cauca',
      area: 36,
      ownerId,
    })

    await farmsQuery.refetch()
    return createdFarm.id
  }

  const ensureCropId = async () => {
    const existingCrop = cropsQuery.data?.[0]
    if (existingCrop) return existingCrop.id

    const createdCrop = await createCrop.mutateAsync({
      name: 'Maíz amarillo',
      type: 'Grano',
    })

    await cropsQuery.refetch()
    return createdCrop.id
  }

  const handleAddLote = async () => {
    const farmId = await ensureFarmId()
    const cropId = await ensureCropId()
    const nextIndex = rows.length + 1

    await createPlot.mutateAsync({
      name: `Lote de ejemplo ${nextIndex}`,
      area: 5 + nextIndex,
      farmId,
      cropId,
    })

    await plotsQuery.refetch()
    window.alert(`Se agregó el lote de ejemplo ${nextIndex} en el backend`)
  }

  const handleEditLote = async (lote: LoteDisplayRow) => {
    const updatedName = window.prompt('Nombre del lote', lote.nombre)
    if (!updatedName) return

    const updatedArea = window.prompt('Área del lote (ha)', lote.area?.replace(' ha', '') ?? '')
    await updatePlot.mutateAsync({
      id: lote.id,
      name: updatedName,
      ...(updatedArea ? { area: Number(updatedArea) } : {}),
    })

    await plotsQuery.refetch()
    window.alert(`Lote actualizado: ${updatedName}`)
  }

  const handleDeleteLote = async (lote: LoteDisplayRow) => {
    const confirmed = window.confirm(`Eliminar ${lote.nombre}?`)
    if (!confirmed) return

    await removePlot.mutateAsync({ id: lote.id })
    await plotsQuery.refetch()
    window.alert(`Lote eliminado: ${lote.nombre}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Produccion</p>
          <h1 className="text-3xl font-bold">Gestion de lotes</h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleAddLote}>
          + Nuevo Lote
        </button>
      </div>
      {plotsQuery.isLoading || farmsQuery.isLoading || cropsQuery.isLoading || usersQuery.isLoading ? (
        <div className="text-sm text-[color:var(--ink-soft)]">Cargando lotes...</div>
      ) : (
        <LoteTable lotes={rows} onEdit={handleEditLote} onDelete={handleDeleteLote} />
      )}
    </div>
  )
}
