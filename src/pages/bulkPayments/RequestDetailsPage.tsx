import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { exportRequest, getRequestDetails, retryFailed } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { BulkRequestTransactionRow } from '../../types'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { StatCard } from '../../components/ui/StatCard'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'

export function RequestDetailsPage() {
  const { id, tag } = useParams()
  const groupId = Number(id)
  const qc = useQueryClient()
  const [modalRow, setModalRow] = useState<BulkRequestTransactionRow | null>(null)

  const q = useQuery({
    queryKey: ['request-details', tag],
    queryFn: () => getRequestDetails(tag!),
    enabled: !!tag,
  })

  const exportMut = useMutation({
    mutationFn: () => exportRequest(tag!),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tag}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const retryMut = useMutation({
    mutationFn: () => retryFailed(tag!),
    onSuccess: () => {
      toast.success('Retry queued')
      void qc.invalidateQueries({ queryKey: ['request-details', tag] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const d = q.data?.data
  const rows = d?.rows ?? []

  const columns: TableColumn<BulkRequestTransactionRow>[] = [
    {
      key: 'm',
      header: 'MEMBER NAME',
      render: (r) => r.member_name,
    },
    { key: 'a', header: 'ACCOUNT DETAIL', render: (r) => r.account },
    {
      key: 's',
      header: 'SERVICE',
      render: (r) => (
        <span className="rounded-full bg-gray-900 px-2 py-0.5 font-mono text-xs text-white">
          {r.service}
        </span>
      ),
    },
    { key: 'am', header: 'AMOUNT', render: (r) => String(r.amount) },
    { key: 'ch', header: 'CHARGES', render: (r) => String(r.charges) },
    {
      key: 'st',
      header: 'REQUEST STATUS',
      render: (r) => (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">{r.status}</span>
      ),
    },
    {
      key: 'tid',
      header: 'TRANSACTION ID',
      render: (r) => <span className="font-mono text-xs">{r.transaction_id}</span>,
    },
    { key: 'resp', header: 'RESPONSE', render: (r) => r.response ?? '—' },
    {
      key: 'act',
      header: 'ACTION',
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => setModalRow(r)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Disbursement Request Details for Tag: {tag}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link to={`/bulk-payments/${groupId}/request-log`}>
            <Button variant="outline">← Back to Log</Button>
          </Link>
          <Button variant="outline" onClick={() => exportMut.mutate()} loading={exportMut.isPending}>
            Export
          </Button>
          <Button variant="outline" onClick={() => void q.refetch()}>
            Refresh
          </Button>
          <Button className="!bg-amber-500 hover:!bg-amber-600" onClick={() => retryMut.mutate()}>
            Retry Failed
          </Button>
        </div>
      </div>

      {d?.notes ? (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">{d.notes}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard color="green" title="Total Requests" value={d?.stats?.total ?? 0} />
        <StatCard color="green" title="Initiated" value={d?.stats?.initiated ?? 0} />
        <StatCard color="yellow" title="Pending" value={d?.stats?.pending ?? 0} />
        <StatCard color="yellow" title="Total Amount" value={d?.stats?.total_amount ?? 0} />
        <StatCard color="yellow" title="Total Charges" value={d?.stats?.total_charges ?? 0} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Processing Progress</h2>
          <span className="text-sm text-green-700">✓ All Completed! {d?.progress?.percent ?? 100}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${d?.progress?.percent ?? 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {d?.progress?.completed ?? 0} Completed | {d?.progress?.rejected ?? 0} Rejected |{' '}
          {d?.progress?.processing ?? 0} Processing | {d?.progress?.queued ?? 0} Queued |{' '}
          {d?.progress?.failed ?? 0} Failed/Timeout
        </p>
      </div>

      <Table columns={columns} data={rows} loading={q.isLoading} emptyMessage="No rows" getRowKey={(r, i) => `${r.transaction_id}-${i}`} />

      <Modal
        isOpen={!!modalRow}
        onClose={() => setModalRow(null)}
        title={`Transaction: ${modalRow?.transaction_id ?? ''}`}
      >
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">{modalRow?.response}</div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setModalRow(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}
