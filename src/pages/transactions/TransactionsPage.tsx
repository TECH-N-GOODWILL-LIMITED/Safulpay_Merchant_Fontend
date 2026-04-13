import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportTransactions, getTransactionHistory } from '../../api/transactions.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { ExpandableTransactionRow } from '../../components/transactions/ExpandableTransactionRow'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { Select } from '../../components/ui/Select'
import { Spinner } from '../../components/ui/Spinner'
import { TRANSACTION_REMARK_OPTIONS } from '../../constants/options'
import type { TransactionHistoryFilters } from '../../types'

const typeOptions = [
  { value: 'all', label: 'All Type' },
  { value: 'credit', label: 'Plus Transactions' },
  { value: 'debit', label: 'Minus Transactions' },
]

const currencyOptions = [
  { value: '', label: 'All Currency' },
  { value: 'SLE', label: 'SLE' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'successful', label: 'Successful' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  const type = searchParams.get('type') ?? 'all'
  const currency = searchParams.get('currency') ?? ''
  const status = searchParams.get('status') ?? ''
  const remark = searchParams.get('remark') ?? ''
  const fromDate = searchParams.get('from_date') ?? ''
  const toDate = searchParams.get('to_date') ?? ''

  const patchParams = (patch: Record<string, string>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v)
      else next.delete(k)
    })
    setSearchParams(next)
  }

  const queryParams = useMemo((): TransactionHistoryFilters => {
    const txType: 'credit' | 'debit' | undefined =
      type === 'credit' ? 'credit' : type === 'debit' ? 'debit' : undefined
    return {
      page,
      per_page: 20,
      type: txType,
      currency: currency || undefined,
      status: status || undefined,
      remark: remark || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }
  }, [page, type, currency, status, remark, fromDate, toDate])

  const historyQuery = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => getTransactionHistory(queryParams),
  })

  const exportMutation = useMutation({
    mutationFn: () =>
      exportTransactions({
        type: queryParams.type,
        currency: queryParams.currency,
        status: queryParams.status,
        remark: queryParams.remark,
        from_date: queryParams.from_date,
        to_date: queryParams.to_date,
      }),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transactions.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export started')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const payload = historyQuery.data?.data
  const pagination = payload?.pagination
  const txList = payload?.transactions ?? []
  const total = pagination?.total ?? 0
  const perPage = pagination?.per_page ?? 20
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  const totalPages = pagination?.total_pages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <Button
          variant="outline"
          icon={<Download className="h-4 w-4" />}
          loading={exportMutation.isPending}
          onClick={() => exportMutation.mutate()}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-3">
        <Select
          label="Transaction type"
          name="type"
          options={typeOptions}
          value={type}
          onChange={(e) => patchParams({ type: e.target.value, page: '1' })}
        />
        <Select
          label="Wallet currency"
          name="currency"
          options={currencyOptions}
          value={currency}
          onChange={(e) => patchParams({ currency: e.target.value, page: '1' })}
        />
        <Select
          label="Status"
          name="status"
          options={statusOptions}
          value={status}
          onChange={(e) => patchParams({ status: e.target.value, page: '1' })}
        />
        <Select
          label="Remark"
          name="remark"
          options={TRANSACTION_REMARK_OPTIONS}
          value={remark}
          onChange={(e) => patchParams({ remark: e.target.value, page: '1' })}
        />
        <div>
          <label className="mb-1 block text-sm text-gray-600">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => patchParams({ from_date: e.target.value, page: '1' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="mt-0.5 text-xs text-gray-400">mm/dd/yyyy</p>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => patchParams({ to_date: e.target.value, page: '1' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="mt-0.5 text-xs text-gray-400">mm/dd/yyyy</p>
        </div>
      </div>

      <div className="space-y-3">
        {historyQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : txList.length ? (
          txList.map((tx) => <ExpandableTransactionRow key={tx.id} tx={tx} />)
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
            No transactions match your filters
          </p>
        )}
      </div>

      {pagination ? (
        <div className="flex flex-col items-center gap-4 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">
            Showing {from} to {to} of {total} results
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => patchParams({ page: String(p) })}
          />
        </div>
      ) : null}
    </div>
  )
}
