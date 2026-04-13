import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getEvents, getTickets, printTickets } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'

const STORAGE_KEY = 'safulpay-print-history'

export function PrintTicketsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [qty, setQty] = useState('24')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [ids, setIds] = useState('')
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? (JSON.parse(s) as string[]) : []
    } catch {
      return []
    }
  })

  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const event = eventsQuery.data?.data?.events?.find((e) => e.id === eventId)

  const ticketsQuery = useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: () => getTickets(eventId),
    enabled: Number.isFinite(eventId),
  })

  const printMut = useMutation({
    mutationFn: (body: Record<string, unknown>) => printTickets(eventId, body),
    onSuccess: () => {
      toast.success('Print job created')
      const label = `${from || 'all'}-${to || 'all'}-${Date.now()}`
      const next = [...history, label].slice(-20)
      setHistory(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const summaryRows = [
    {
      category: 'General',
      available: 0,
      active: 6,
      outside: 0,
      inside: 0,
      total: 6,
    },
  ]

  const cols: TableColumn<(typeof summaryRows)[number]>[] = [
    { key: 'c', header: 'Category', render: (r) => r.category },
    { key: 'av', header: 'Available', render: (r) => String(r.available) },
    { key: 'ac', header: 'Active', render: (r) => String(r.active) },
    { key: 'o', header: 'Outside', render: (r) => String(r.outside) },
    { key: 'i', header: 'Inside', render: (r) => String(r.inside) },
    { key: 't', header: 'Total', render: (r) => String(r.total) },
  ]

  if (!Number.isFinite(eventId)) return <p className="text-red-600">Invalid event</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Print Tickets</h1>
          <p className="text-sm text-gray-600">{event?.title}</p>
        </div>
        <Link to={`/events/${eventId}/tickets`}>
          <Button variant="outline">← Back to Tickets</Button>
        </Link>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
        ℹ Select tickets to print. Tickets will be arranged 2 per row on A4 paper with tear-off stubs.
      </div>

      <div className="grid gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-3">
        <Select
          label="Category"
          name="cat"
          options={[
            { value: '', label: 'All Categories' },
            { value: 'general', label: 'General' },
          ]}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          label="Status"
          name="st"
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Select
          label="Quantity"
          name="qty"
          options={[
            { value: '12', label: '12 tickets (1 page)' },
            { value: '24', label: '24 tickets (2 pages)' },
          ]}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <p className="text-xs text-gray-500">(12 per page)</p>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800">Ticket Range (by order number)</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="From"
          />
          <span className="text-sm text-gray-600">to</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="To"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">e.g., 1 to 12 means first 12 tickets in order</p>

        <h3 className="mt-6 font-semibold text-gray-800">Or Specific Ticket IDs (comma separated)</h3>
        <input
          value={ids}
          onChange={(e) => setIds(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g., 1, 5, 10, 15"
        />
        <p className="mt-1 text-xs text-gray-500">Database IDs, leave empty to use filters above</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                const start = (p - 1) * 12 + 1
                setFrom(String(start))
                setTo(String(start + 11))
              }}
            >
              Preset {p}
            </Button>
          ))}
        </div>

        <Button
          className="mt-6 w-full"
          loading={printMut.isPending}
          onClick={() =>
            printMut.mutate({
              category: category || undefined,
              status: status || undefined,
              quantity: Number(qty),
              from: from ? Number(from) : undefined,
              to: to ? Number(to) : undefined,
              ids: ids
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map(Number),
            })
          }
        >
          Generate Printable Tickets
        </Button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Print History (this browser)</h2>
          <Button
            variant="danger"
            size="sm"
            type="button"
            onClick={() => {
              setHistory([])
              localStorage.removeItem(STORAGE_KEY)
            }}
          >
            Clear
          </Button>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No ranges printed yet</p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {history.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-gray-500">Printed ranges are highlighted in green below</p>
      </div>

      <Table
        columns={cols}
        data={summaryRows}
        loading={ticketsQuery.isLoading}
        emptyMessage="No data"
        getRowKey={(r) => r.category}
      />
    </div>
  )
}
