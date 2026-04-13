import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages < 1) return null

  const windowSize = 5
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2))
  let end = Math.min(totalPages, start + windowSize - 1)
  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1)
  }
  const pages: number[] = []
  for (let p = start; p <= end; p++) pages.push(p)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {start > 1 ? (
        <>
          <PageBtn page={1} current={currentPage} onPageChange={onPageChange} />
          {start > 2 ? <span className="px-1 text-gray-400">…</span> : null}
        </>
      ) : null}
      {pages.map((p) => (
        <PageBtn key={p} page={p} current={currentPage} onPageChange={onPageChange} />
      ))}
      {end < totalPages ? (
        <>
          {end < totalPages - 1 ? <span className="px-1 text-gray-400">…</span> : null}
          <PageBtn page={totalPages} current={currentPage} onPageChange={onPageChange} />
        </>
      ) : null}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function PageBtn({
  page,
  current,
  onPageChange,
}: {
  page: number
  current: number
  onPageChange: (p: number) => void
}) {
  const active = page === current
  return (
    <button
      type="button"
      onClick={() => onPageChange(page)}
      className={`min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium ${
        active ? 'bg-brand text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {page}
    </button>
  )
}
