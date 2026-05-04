"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function PrediosPage() {
  const { data = [], isLoading } = trpc.farms.listAll.useQuery()

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
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            + Nuevo predio
          </button>
        }
      >
        {isLoading ? (
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
                {data.map((farm: any) => (
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
            {!data.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay predios registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
