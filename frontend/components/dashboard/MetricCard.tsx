interface MetricCardProps {
  title: string
  value: string | number
}

export default function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="panel rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">{title}</p>
      <p className="text-3xl font-semibold mt-3 text-[color:var(--ink-strong)]">{value}</p>
      <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
    </div>
  )
}
