'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { mes: 'Ene', rendimiento: 75 },
  { mes: 'Feb', rendimiento: 78 },
  { mes: 'Mar', rendimiento: 82 },
  { mes: 'Abr', rendimiento: 85 },
  { mes: 'May', rendimiento: 87 },
  { mes: 'Jun', rendimiento: 89 },
]

export default function RendimientoChart() {
  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rendimiento mensual</h2>
        <span className="text-xs text-[color:var(--ink-soft)]">Ultimos 6 meses</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rendimiento" stroke="#1b8a6b" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
