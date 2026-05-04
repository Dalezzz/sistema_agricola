import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function Panel({ title, description, action, children }: PanelProps) {
  return (
    <section className="panel rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--ink-strong)]">{title}</h2>
          {description && (
            <p className="text-sm text-[color:var(--ink-soft)]">{description}</p>
          )}
        </div>
        {action && <div className="mt-3 sm:mt-0">{action}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}
