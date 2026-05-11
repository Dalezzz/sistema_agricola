"use client"

import { useState } from 'react'
import Panel from '@/components/ui/Panel'
import { trpc } from '@/lib/trpc/react'

type ReportData = {
  id: string
  title: string
  type: string
  content: string
  summary: string | null
  metrics: string | null
  recommendations: string | null
  createdAt: string
}

const typeIcons: Record<string, string> = {
  'Ejecutivo': '📊',
  'Riego': '💧',
  'Clima': '🌤️',
  'Tecnico': '🔧',
  'Proyeccion': '📈',
}

const typeColors: Record<string, string> = {
  'Ejecutivo': 'bg-blue-100 text-blue-800 border-blue-200',
  'Riego': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Clima': 'bg-amber-100 text-amber-800 border-amber-200',
  'Tecnico': 'bg-purple-100 text-purple-800 border-purple-200',
  'Proyeccion': 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

export default function ReportesPage() {
  const reportsQuery = trpc.reports.list.useQuery()
  const utils = trpc.useUtils()
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)

  const reportes = (reportsQuery.data ?? []).map((reporte: any) => ({
    id: reporte.id,
    titulo: reporte.title,
    tipo: reporte.type,
    fecha: new Date(reporte.createdAt).toISOString().slice(0, 10),
  }))

  const handleSelectReport = async (reporte: { id: string }) => {
    if (selectedReport?.id === reporte.id) {
      setSelectedReport(null)
      return
    }
    const record = await utils.reports.byId.fetch({ id: reporte.id })
    if (record) {
      setSelectedReport(record)
    }
  }

  const handleDownloadReport = async (reporte: { id: string; titulo: string }) => {
    const pdf = await utils.reports.generatePdf.fetch({ reportId: reporte.id })
    const binary = atob(pdf.base64)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: pdf.mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = pdf.fileName
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const parseJson = (jsonStr: string | null): Record<string, any> => {
    if (!jsonStr) return {}
    try {
      return JSON.parse(jsonStr)
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Analitica</p>
        <h1 className="text-3xl font-bold">Reportes</h1>
      </div>

      <Panel
        title="Reportes del Sistema"
        description="Selecciona un reporte para ver sus detalles. Todos los reportes incluyen metricas, resumen y recomendaciones."
      >
        {reportsQuery.isLoading ? (
          <div className="text-sm text-[color:var(--ink-soft)]">Cargando reportes...</div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportes.map((reporte) => {
                const isSelected = selectedReport?.id === reporte.id
                return (
                  <div
                    key={reporte.id}
                    className={`
                      relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                      ${isSelected 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200' 
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                      }
                    `}
                    onClick={() => handleSelectReport(reporte)}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="text-2xl">{typeIcons[reporte.tipo] || '📄'}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${typeColors[reporte.tipo] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {reporte.tipo}
                      </span>
                    </div>
                    <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2">{reporte.titulo}</h3>
                    <p className="text-sm text-gray-500">{reporte.fecha}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectReport(reporte)
                        }}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {isSelected ? 'Ocultar' : 'Ver detalles'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadReport(reporte)
                        }}
                        className="flex-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {!reportes.length && (
              <div className="p-6 text-sm text-[color:var(--ink-soft)] text-center">
                No hay reportes disponibles.
              </div>
            )}
          </div>
        )}
      </Panel>

      {selectedReport && (
        <Panel
          title={`Detalle: ${selectedReport.title}`}
          description={`Tipo: ${selectedReport.type} | Fecha: ${new Date(selectedReport.createdAt).toLocaleDateString('es-ES')}`}
          action={
            <button
              onClick={() => handleDownloadReport({ id: selectedReport.id, titulo: selectedReport.title })}
              className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
            >
              Descargar PDF
            </button>
          }
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Descripcion</h3>
              <p className="text-gray-700">{selectedReport.content}</p>
            </div>

            {selectedReport.summary && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <h3 className="mb-2 text-lg font-semibold text-emerald-800">Resumen Ejecutivo</h3>
                <p className="text-emerald-900">{selectedReport.summary}</p>
              </div>
            )}

            {selectedReport.metrics && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Metricas Clave</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(parseJson(selectedReport.metrics)).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-xl font-bold text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport.recommendations && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Recomendaciones</h3>
                <ul className="space-y-2">
                  {parseJson(selectedReport.recommendations).map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <span className="mt-0.5 text-amber-600">⚡</span>
                      <span className="text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  )
}