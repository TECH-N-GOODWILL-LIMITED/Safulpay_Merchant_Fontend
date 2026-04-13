import { format, formatDistanceToNow } from 'date-fns'

export function formatCurrency(amount: number, currency = 'SLE'): string {
  const formatted = new Intl.NumberFormat('en-SL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `LE${formatted} ${currency}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, "MMM d yyyy '@'h:mma")
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatTransactionId(id: string): string {
  return id
}
