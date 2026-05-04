"use client"

type ReporteRow = {
  id: string
  titulo: string
  fecha: string
  tipo: string
}

type ReporteListProps = {
  reportes: ReporteRow[]
  onView?: (reporte: ReporteRow) => void
  onDownload?: (reporte: ReporteRow) => void
}

export default function ReporteList({ reportes, onView, onDownload }: ReporteListProps) {

  return (
    <div className="panel rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[color:var(--surface-muted)] border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.id} className="border-b hover:bg-[color:var(--surface-muted)]">
              <td className="px-6 py-4 font-medium">{reporte.titulo}</td>
              <td className="px-6 py-4">{reporte.tipo}</td>
              <td className="px-6 py-4">{reporte.fecha}</td>
              <td className="px-6 py-4 space-x-2">
                <button type="button" className="text-blue-600 hover:underline" onClick={() => onView?.(reporte)}>
                  Ver
                </button>
                <button type="button" className="text-green-600 hover:underline" onClick={() => onDownload?.(reporte)}>
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!reportes.length && (
        <div className="p-6 text-sm text-[color:var(--ink-soft)]">No hay reportes disponibles.</div>
      )}
    </div>
  )
}
