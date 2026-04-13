type BadgeStatus =
  | 'active'
  | 'pending'
  | 'cancelled'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'enabled'
  | 'disabled'
  | 'one_time'
  | 'continuous'
  | 'requested'
  | 'inactive'

const map: Record<BadgeStatus, string> = {
  active: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  enabled: 'bg-green-100 text-green-700',
  continuous: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  requested: 'bg-yellow-100 text-yellow-700',
  one_time: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  disabled: 'bg-orange-100 text-orange-700',
  inactive: 'bg-gray-100 text-gray-600',
}

function labelFor(status: BadgeStatus): string {
  return status.replace(/_/g, ' ')
}

export function Badge({
  status,
  children,
}: {
  status: BadgeStatus
  children?: React.ReactNode
}) {
  const cls = map[status] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {children ?? labelFor(status)}
    </span>
  )
}
