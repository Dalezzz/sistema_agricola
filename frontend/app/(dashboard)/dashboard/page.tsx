"use client"

import { useMemo } from 'react'
import MetricCard from '@/components/dashboard/MetricCard'
import RendimientoChart from '@/components/dashboard/RendimientoChart'
import AlertaList from '@/components/dashboard/AlertaList'
import { demoFarmRows, demoPlotRows, demoReportRows } from '@/lib/demo-data'
import { trpc } from '@/lib/trpc/react'

export default function DashboardPage() {
  const { data: farms = [] } = trpc.farms.listAll.useQuery()
  const { data: plots = [] } = trpc.plots.listAll.useQuery()
  const { data: reports = [] } = trpc.reports.list.useQuery()

  const dashboardStats = useMemo(() => {
    const farmCount = farms.length || demoFarmRows.length
    const plotCount = plots.length || demoPlotRows.length
    const reportCount = reports.length || demoReportRows.length

    return {
      farmCount,
      plotCount,
      reportCount,
      alertCount: Math.min(reportCount, 3),
    }
  }, [farms.length, plots.length, reports.length])

  const handleExportSummary = () => {
    const summary = [
      'Resumen del sistema',
      `Predios: ${dashboardStats.farmCount}`,
      `Lotes: ${dashboardStats.plotCount}`,
      `Reportes: ${dashboardStats.reportCount}`,
      `Alertas: ${dashboardStats.alertCount}`,
    ].join('\n')

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'resumen-dashboard.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-soft)]">Centro de control</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <button className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50" onClick={handleExportSummary}>
          Exportar resumen
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger">
        <MetricCard title="Predios" value={dashboardStats.farmCount} />
        <MetricCard title="Lotes Activos" value={dashboardStats.plotCount} />
        <MetricCard title="Reportes" value={dashboardStats.reportCount} />
        <MetricCard title="Alertas" value={dashboardStats.alertCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RendimientoChart />
        <AlertaList />
      </div>
    </div>
  )
}
