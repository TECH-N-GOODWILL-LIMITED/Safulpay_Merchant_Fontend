import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Tag } from 'lucide-react'
import { getSinglePaymentHistory } from '../../api/singlePayment.api'
import type { SinglePaymentHistoryRow } from '../../types'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { Modal } from '../../components/ui/Modal'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function SinglePaymentHistoryPage() {
  const [detail, setDetail] = useState<SinglePaymentHistoryRow | null>(null)

  const q = useQuery({
    queryKey: ['single-payment-history'],
    queryFn: () => getSinglePaymentHistory({ page: 1, per_page: 50 }),
  })

  const rows = q.data?.data?.items ?? []

  const columns: TableColumn<SinglePaymentHistoryRow>[] = [
    {
      key: 'tag',
      header: 'REQUEST TAG',
      render: (r) => (
        <span className="flex items-center gap-2 font-mono text-sm">
          <Tag className="h-4 w-4 text-brand" />
          {r.tag}
        </span>
      ),
    },
    {
      key: 'rec',
      header: 'RECIPIENT',
      render: (r) => (
        <div>
          <p className="font-semibold">{r.recipient_name}</p>
          <p className="text-xs text-gray-500">{r.recipient_phone}</p>
        </div>
      ),
    },
    {
      key: 'svc',
      header: 'SERVICE',
      render: (r) => (
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
          {r.service}
        </span>
      ),
    },
    {
      key: 'amt',
      header: 'AMOUNT',
      render: (r) => formatCurrency(r.amount, r.currency),
    },
    {
      key: 'st',
      header: 'STATUS',
      render: (r) => (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
          {r.status}
        </span>
      ),
    },
    {
      key: 'dt',
      header: 'DATE',
      render: (r) => formatDate(r.date),
    },
    {
      key: 'act',
      header: 'ACTIONS',
      render: (r) => (
        <Button size="sm" variant="outline" className="!text-blue-600" onClick={() => setDetail(r)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Single Payment History</h1>
        <Link to="/single-payment">
          <Button>+ New Payment</Button>
        </Link>
      </div>
      <Table columns={columns} data={rows} loading={q.isLoading} emptyMessage="No payments" getRowKey={(r) => r.tag} />

      <Modal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title="Payment Details"
        size="lg"
      >
        {detail ? (
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p className="text-gray-500">Request Tag</p>
            <p className="font-mono font-medium">{detail.tag}</p>
            <p className="text-gray-500">Recipient</p>
            <p>{detail.recipient_name}</p>
            <p className="text-gray-500">Account</p>
            <p>{detail.account}</p>
            <p className="text-gray-500">Service</p>
            <p>{detail.service}</p>
            <p className="text-gray-500">Amount</p>
            <p>{formatCurrency(detail.amount, detail.currency)}</p>
            {detail.payout_response ? (
              <div className="md:col-span-2 rounded-lg bg-blue-50 p-3 text-blue-900">
                {detail.payout_response}
              </div>
            ) : null}
            <div className="md:col-span-2 flex justify-end">
              <Button variant="secondary" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
