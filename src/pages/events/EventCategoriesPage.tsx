import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { addCategory, getCategories, getEvents } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'

const schema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  currency: z.string().min(1),
  description: z.string().optional(),
  max_tickets: z.string().optional(),
})

type Form = z.infer<typeof schema>

interface CatRow {
  id: number
  name: string
  price: number
  currency: string
  max_tickets: number | null
  sold?: number
  status?: string
}

function isCatRow(x: unknown): x is CatRow {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x
}

export function EventCategoriesPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const qc = useQueryClient()

  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const event = eventsQuery.data?.data?.events?.find((e) => e.id === eventId)

  const catsQuery = useQuery({
    queryKey: ['event-categories', eventId],
    queryFn: () => getCategories(eventId),
    enabled: Number.isFinite(eventId),
  })

  const rows: CatRow[] = (catsQuery.data?.data?.categories ?? []).filter(isCatRow)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: 0, currency: 'SLE', description: '', max_tickets: '' },
  })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => addCategory(eventId, body),
    onSuccess: () => {
      toast.success('Category added')
      reset()
      void qc.invalidateQueries({ queryKey: ['event-categories', eventId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onSubmit = (v: Form) => {
    mutation.mutate({
      name: v.name,
      price: v.price,
      currency: v.currency,
      description: v.description,
      max_tickets: v.max_tickets ? Number(v.max_tickets) : null,
    })
  }

  const columns: TableColumn<CatRow>[] = [
    { key: 'n', header: 'CATEGORY', render: (r) => r.name },
    {
      key: 'p',
      header: 'PRICE',
      render: (r) => formatCurrency(r.price, r.currency),
    },
    {
      key: 't',
      header: 'TICKETS',
      render: (r) => (
        <span>
          Sold: {r.sold ?? 0} / {r.max_tickets == null ? 'Unlimited' : r.max_tickets}
        </span>
      ),
    },
    {
      key: 's',
      header: 'STATUS',
      render: () => <Badge status="active">Active</Badge>,
    },
    {
      key: 'a',
      header: 'ACTION',
      render: () => (
        <Link to={`/events/${eventId}/tickets`}>
          <Button size="sm" variant="outline">
            View Tickets
          </Button>
        </Link>
      ),
    },
  ]

  if (!Number.isFinite(eventId)) return <p className="text-red-600">Invalid event</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Categories</h1>
          <p className="text-sm text-gray-600">{event?.title}</p>
        </div>
        <Link to="/events">
          <Button variant="outline">← Back to Events</Button>
        </Link>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <Input
          label="Category Name"
          name="name"
          placeholder="e.g. VIP, General, Early Bird"
          register={register('name')}
          required
          error={errors.name?.message}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="number"
            step="0.01"
            label="Price"
            name="price"
            register={register('price')}
            required
            error={errors.price?.message}
          />
          <Select
            label="Currency"
            name="currency"
            options={[
              { value: 'SLE', label: 'SLE' },
              { value: 'USD', label: 'USD' },
            ]}
            register={register('currency')}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Description</label>
          <textarea
            rows={3}
            placeholder="Category description"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            {...register('description')}
          />
        </div>
        <Input
          type="number"
          label="Max Tickets"
          name="max_tickets"
          placeholder="Leave empty for unlimited"
          register={register('max_tickets')}
        />
        <p className="text-xs text-gray-500">Leave empty for unlimited tickets</p>
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Add Category
        </Button>
      </form>

      <Table columns={columns} data={rows} loading={catsQuery.isLoading} emptyMessage="No categories" getRowKey={(r) => r.id} />
    </div>
  )
}
