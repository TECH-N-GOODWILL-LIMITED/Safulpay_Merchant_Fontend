import type { ReactNode } from 'react'

type Accent = 'green' | 'blue' | 'yellow' | 'purple'

const borderClass: Record<Accent, string> = {
  green: 'border-l-brand',
  blue: 'border-l-blue-500',
  yellow: 'border-l-amber-500',
  purple: 'border-l-purple-600',
}

const valueClass: Record<Accent, string> = {
  green: 'text-brand',
  blue: 'text-blue-600',
  yellow: 'text-amber-600',
  purple: 'text-purple-600',
}

export function StatCard({
  title,
  value,
  subtitle,
  color = 'green',
}: {
  title: string
  value: ReactNode
  subtitle?: string
  color?: Accent
}) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm border-l-4 ${borderClass[color]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass[color]}`}>{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
    </div>
  )
}
