"use client"

import MetricCard from '@/components/dashboard/MetricCard'
import RendimientoChart from '@/components/dashboard/RendimientoChart'
import AlertaList from '@/components/dashboard/AlertaList'
import { trpc } from '@/lib/trpc/react'

export default function DashboardPage() {
  const { data: farms = [] } = trpc.farms.listAll.useQuery()
  const { data: plots = [] } = trpc.plots.listAll.useQuery()
  const { data: reports = [] } = trpc.reports.list.useQuery()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Centro de control</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="text-sm text-[color:var(--ink-soft)]">Estado del sistema operativo</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger">
        <MetricCard title="Predios" value={farms.length} />
        <MetricCard title="Lotes Activos" value={plots.length} />
        <MetricCard title="Reportes" value={reports.length} />
        <MetricCard title="Alertas" value={Math.min(reports.length, 3)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RendimientoChart />
        <AlertaList />
      </div>
    </div>
  )
}
