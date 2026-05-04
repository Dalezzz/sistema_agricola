"use client"

import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-ES') : 'N/D'

export default function CultivosPage() {
  const { data = [], isLoading } = trpc.crops.list.useQuery()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Produccion</p>
        <h1 className="text-3xl font-bold">Cultivos</h1>
      </div>

      <Panel
        title="Catalogo de cultivos"
        description="Tipos disponibles y lotes asociados."
        action={
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            + Nuevo cultivo
          </button>
        }
      >
        {isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando cultivos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[color:var(--surface-muted)] border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lotes asociados</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Creado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((crop: any) => (
                  <tr key={crop.id} className="border-b hover:bg-[color:var(--surface-muted)]">
                    <td className="px-4 py-3 font-medium">{crop.name}</td>
                    <td className="px-4 py-3 text-sm text-[color:var(--ink-soft)]">{crop.type}</td>
                    <td className="px-4 py-3 text-sm">{crop.plots?.length ?? 0}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(crop.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.length && (
              <div className="p-4 text-sm text-[color:var(--ink-soft)]">No hay cultivos registrados.</div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
