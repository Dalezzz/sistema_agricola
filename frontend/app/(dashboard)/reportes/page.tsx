"use client"

import ReporteList from '@/components/reportes/ReporteList'
import { trpc } from '@/lib/trpc/react'

export default function ReportesPage() {
  const { data = [], isLoading } = trpc.reports.list.useQuery()
  const reportes = data.map((reporte: any) => ({
    id: reporte.id,
    titulo: reporte.title,
    tipo: reporte.type,
    fecha: new Date(reporte.createdAt).toISOString().slice(0, 10),
  }))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Analitica</p>
        <h1 className="text-3xl font-bold">Reportes</h1>
      </div>
      {isLoading ? (
        <div className="text-sm text-[color:var(--ink-soft)]">Cargando reportes...</div>
      ) : (
        <ReporteList reportes={reportes} />
      )}
    </div>
  )
}
