type LoteRow = {
  id: string
  nombre: string
  cultivo?: string | null
  area?: string | null
  estado?: string | null
}

type LoteTableProps = {
  lotes: LoteRow[]
}

export default function LoteTable({ lotes }: LoteTableProps) {

  return (
    <div className="panel rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[color:var(--surface-muted)] border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Cultivo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Área</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.id} className="border-b hover:bg-[color:var(--surface-muted)]">
              <td className="px-6 py-4">{lote.nombre}</td>
              <td className="px-6 py-4">{lote.cultivo || 'Sin cultivo'}</td>
              <td className="px-6 py-4">{lote.area || 'N/D'}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-sm">
                  {lote.estado || 'Activo'}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button className="text-blue-600 hover:underline">Editar</button>
                <button className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!lotes.length && (
        <div className="p-6 text-sm text-[color:var(--ink-soft)]">No hay lotes registrados.</div>
      )}
    </div>
  )
}
