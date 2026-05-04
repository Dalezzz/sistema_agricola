"use client"

import Panel from '@/components/ui/Panel'
import ReporteList from '@/components/reportes/ReporteList'
import { trpc } from '@/lib/trpc/react'

export default function ReportesPage() {
  const reportsQuery = trpc.reports.list.useQuery()
  const createReport = trpc.reports.create.useMutation()
  const utils = trpc.useUtils()

  const reportes = (reportsQuery.data ?? []).map((reporte: any) => ({
    id: reporte.id,
    titulo: reporte.title,
    tipo: reporte.type,
    fecha: new Date(reporte.createdAt).toISOString().slice(0, 10),
  }))

  const handleAddReport = async () => {
    await createReport.mutateAsync({
      title: 'Reporte de ejemplo',
      type: 'Operativo',
      content: 'Reporte generado desde el backend real para validar el flujo de creación.',
    })

    await reportsQuery.refetch()
    window.alert('Se agregó un reporte real en el backend')
  }

  const handleViewReport = async (reporte: { id: string; titulo: string; tipo: string; fecha: string }) => {
    const record = await utils.reports.byId.fetch({ id: reporte.id })
    window.alert(
      `Reporte: ${record?.title ?? reporte.titulo}\nTipo: ${record?.type ?? reporte.tipo}\nFecha: ${reporte.fecha}\nContenido: ${record?.content ?? 'Sin contenido'}`,
    )
  }

  const handleDownloadReport = async (reporte: { id: string; titulo: string }) => {
    const pdf = await utils.reports.generatePdf.fetch({ reportId: reporte.id })
    const binary = atob(pdf.base64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    const blob = new Blob([bytes], { type: pdf.mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = pdf.fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Analitica</p>
        <h1 className="text-3xl font-bold">Reportes</h1>
      </div>

      <Panel
        title="Panel de reportes"
        description="Resumen histórico y descarga de reportes de ejemplo."
        action={
          <button
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            onClick={handleAddReport}
          >
            + Generar reporte
          </button>
        }
      >
        {reportsQuery.isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando reportes...</div>
        ) : (
          <ReporteList reportes={reportes} onView={handleViewReport} onDownload={handleDownloadReport} />
        )}
      </Panel>
    </div>
  )
}
