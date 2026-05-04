export default function AlertaList() {
  const alertas = [
    { id: 1, titulo: 'Riego necesario', lote: 'Lote A', prioridad: 'Alta' },
    { id: 2, titulo: 'Plagas detectadas', lote: 'Lote C', prioridad: 'Crítica' },
    { id: 3, titulo: 'Humedad baja', lote: 'Lote B', prioridad: 'Media' },
  ]

  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alertas críticas</h2>
        <span className="text-xs text-[color:var(--ink-soft)]">Ultimas 24h</span>
      </div>
      <div className="mt-5 space-y-3">
        {alertas.map((alerta) => (
          <div key={alerta.id} className="flex justify-between items-center p-3 rounded-xl bg-[color:var(--surface-muted)]">
            <div>
              <p className="font-medium">{alerta.titulo}</p>
              <p className="text-sm text-[color:var(--ink-soft)]">{alerta.lote}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              alerta.prioridad === 'Alta' ? 'bg-orange-100 text-orange-800' :
              alerta.prioridad === 'Crítica' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {alerta.prioridad}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
