"use client"

import LoteTable from '@/components/lotes/LoteTable'
import { trpc } from '@/lib/trpc/react'

export default function LotesPage() {
  const { data = [], isLoading } = trpc.plots.listAll.useQuery()
  const lotes = data.map((plot: any) => ({
    id: plot.id,
    nombre: plot.name,
    cultivo: plot.crop?.name ?? null,
    area: plot.area ? `${plot.area} ha` : null,
    estado: 'Activo',
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Produccion</p>
          <h1 className="text-3xl font-bold">Gestion de lotes</h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nuevo Lote
        </button>
      </div>
      {isLoading ? (
        <div className="text-sm text-[color:var(--ink-soft)]">Cargando lotes...</div>
      ) : (
        <LoteTable lotes={lotes} />
      )}
    </div>
  )
}
