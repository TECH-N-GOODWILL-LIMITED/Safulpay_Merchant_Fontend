import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { getEvents, getTickets, sellTicket } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { StatCard } from '../../components/ui/StatCard'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'

const schema = z.object({
  category: z.string().min(1),
  buyer_phone: z.string().min(1),
  buyer_name: z.string().optional(),
  buyer_email: z.string().optional(),
  quantity: z.coerce.number().min(1),
})

type Form = z.infer<typeof schema>

interface TicketRow {
  id: number
  ticket_number: string
  category: string
  buyer_name: string
  buyer_email?: string
  buyer_phone: string
  price: number
  currency: string
  status: string
  image_url?: string | null
  purchased_at: string
}

function isTicket(x: unknown): x is TicketRow {
  return typeof x === 'object' && x !== null && 'ticket_number' in x
}

export function EventTicketsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const qc = useQueryClient()

  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const event = eventsQuery.data?.data?.events?.find((e) => e.id === eventId)

  const ticketsQuery = useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: async () => {
      const raw = await getTickets(eventId)
      if (Array.isArray(raw)) return raw
      if (raw && typeof raw === 'object' && 'data' in raw) {
        const inner = (raw as { data: unknown }).data
        if (Array.isArray(inner)) return inner
        if (inner && typeof inner === 'object' && 'tickets' in inner) {
          const t = (inner as { tickets: unknown }).tickets
          return Array.isArray(t) ? t : []
        }
      }
      return []
    },
    enabled: Number.isFinite(eventId),
  })

  const rows: TicketRow[] = (ticketsQuery.data ?? []).filter(isTicket)

  const categories = Array.from(new Set(rows.map((r) => r.category))).map((c) => ({
    value: c,
    label: c,
  }))

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: '', buyer_phone: '', quantity: 1 },
  })

  const sellMut = useMutation({
    mutationFn: (body: Record<string, unknown>) => sellTicket(eventId, body),
    onSuccess: () => {
      toast.success('Ticket sold')
      void qc.invalidateQueries({ queryKey: ['event-tickets', eventId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onSubmit = (v: Form) => sellMut.mutate({ ...v })

  const columns: TableColumn<TicketRow>[] = [
    {
      key: 'sn',
      header: 'S/N',
      render: (_r, index) => index + 1,
    },
    {
      key: 'tn',
      header: 'TICKET NUMBER',
      render: (r) => <span className="font-mono text-xs">{r.ticket_number}</span>,
    },
    {
      key: 'cat',
      header: 'CATEGORY',
      render: (r) => (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">{r.category}</span>
      ),
    },
    {
      key: 'buyer',
      header: 'BUYER',
      render: (r) => (
        <div>
          <p className="font-medium">{r.buyer_name}</p>
          {r.buyer_email ? <p className="text-xs text-gray-500">{r.buyer_email}</p> : null}
        </div>
      ),
    },
    { key: 'ph', header: 'PHONE', render: (r) => r.buyer_phone },
    {
      key: 'pr',
      header: 'PRICE',
      render: (r) => formatCurrency(r.price, r.currency),
    },
    {
      key: 'st',
      header: 'STATUS',
      render: (r) => <Badge status="active">{r.status}</Badge>,
    },
    {
      key: 'img',
      header: 'TICKET IMAGE',
      render: (r) =>
        r.image_url ? (
          <Button size="sm" variant="outline" className="!text-blue-600">
            View
          </Button>
        ) : (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">No Image</span>
        ),
    },
    { key: 'at', header: 'PURCHASED AT', render: (r) => r.purchased_at },
  ]

  if (!Number.isFinite(eventId)) return <p className="text-red-600">Invalid event</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Tickets</h1>
          <p className="text-sm text-gray-600">{event?.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/events/${eventId}/tickets/print`}>
            <Button variant="outline">Print Batch</Button>
          </Link>
          <Link to={`/events/${eventId}/analytics`}>
            <Button variant="outline">Analytics</Button>
          </Link>
          <Link to={`/events/${eventId}/categories`}>
            <Button variant="outline">Categories</Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary">← Back to Events</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard color="green" title="Active Tickets" value={rows.filter((r) => r.status.toLowerCase() === 'active').length} />
        <StatCard color="blue" title="Available" value={0} />
        <StatCard color="yellow" title="Outside" value={0} />
        <StatCard color="green" title="Inside" value={0} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Sell Ticket</h2>
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <Select
            label="Category"
            name="category"
            options={categories.length ? categories : [{ value: '_', label: 'No categories yet' }]}
            register={register('category')}
            required
          />
          <Input
            label="Buyer Phone"
            name="buyer_phone"
            placeholder="e.g. 2327xxxxxxxx"
            register={register('buyer_phone')}
            required
            error={errors.buyer_phone?.message}
          />
          <Input label="Buyer Name" name="buyer_name" register={register('buyer_name')} />
          <Input label="Buyer Email" name="buyer_email" type="email" register={register('buyer_email')} />
          <Input
            type="number"
            label="Quantity"
            name="quantity"
            register={register('quantity')}
            required
            error={errors.quantity?.message}
          />
          <div className="md:col-span-2">
            <Button type="submit" className="w-full" loading={sellMut.isPending}>
              Sell Ticket(s)
            </Button>
          </div>
        </form>
      </div>

      <Table
        columns={columns}
        data={rows}
        loading={ticketsQuery.isLoading}
        emptyMessage="No tickets sold yet"
        getRowKey={(r) => r.id}
      />
    </div>
  )
}
