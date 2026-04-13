import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Copy, Link2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deletePaymentLink, getPaymentLinks } from '../../api/paymentLinks.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { PaymentLink } from '../../types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatDate } from '../../utils/formatters'

export function PaymentLinksPage() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['payment-links'], queryFn: getPaymentLinks })

  const del = useMutation({
    mutationFn: (code: string) => deletePaymentLink(code),
    onSuccess: () => {
      toast.success('Link deleted')
      void qc.invalidateQueries({ queryKey: ['payment-links'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const copy = (code: string) => {
    void navigator.clipboard.writeText(code)
    toast.success('Copied')
  }

  const columns: TableColumn<PaymentLink>[] = [
    {
      key: 'link',
      header: 'PAYMENT LINK',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <Link2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono font-semibold text-gray-900">{row.code}</p>
            <Button size="sm" variant="outline" onClick={() => copy(row.link_url || row.code)}>
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'amt',
      header: 'AMOUNT',
      render: (row) =>
        row.amount == null ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">Any Amount</span>
        ) : (
          <span>{row.amount_display || `LE ${row.amount} / ${row.currency}`}</span>
        ),
    },
    { key: 'note', header: 'NOTE', render: (row) => row.note },
    {
      key: 'type',
      header: 'TYPE',
      render: (row) =>
        row.type === 'one_time' ? (
          <Badge status="one_time">One-time</Badge>
        ) : (
          <Badge status="continuous">Continuous</Badge>
        ),
    },
    {
      key: 'created',
      header: 'CREATED',
      render: (row) => formatDate(row.created_at),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            if (confirm('Delete this link?')) del.mutate(row.code)
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links (Collections)</h1>
          <p className="text-sm text-gray-600">
            Create and manage payment links for collecting payments
          </p>
        </div>
        <Link to="/payment-links/create">
          <Button>+ Create Link</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        data={q.data?.data?.links ?? []}
        loading={q.isLoading}
        emptyMessage="No payment links"
        getRowKey={(r) => r.id}
      />
    </div>
  )
}
