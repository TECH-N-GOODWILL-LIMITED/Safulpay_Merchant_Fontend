const sizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-brand border-t-transparent ${sizeMap[size]}`}
      role="status"
      aria-label="Loading"
    />
  )
}
