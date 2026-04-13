import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { addOrganizer, getEvents, getOrganizers, removeOrganizer } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { Spinner } from '../../components/ui/Spinner'

const schema = z.object({
  mode: z.string(),
  phone: z.string().min(8).max(8).regex(/^\d+$/),
  role: z.enum(['manager', 'ticketer', 'scanner_in', 'scanner_out']),
})

type Form = z.infer<typeof schema>

interface OrgRow {
  id: number
  name: string
  email: string
  phone: string
  role: string
  assigned_at: string
  is_creator?: boolean
}

function isOrg(x: unknown): x is OrgRow {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x
}

export function EventOrganizersPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const qc = useQueryClient()

  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const event = eventsQuery.data?.data?.events?.find((e) => e.id === eventId)

  const orgQuery = useQuery({
    queryKey: ['event-organizers', eventId],
    queryFn: () => getOrganizers(eventId),
    enabled: Number.isFinite(eventId),
  })

  const rows: OrgRow[] = (orgQuery.data?.data?.organizers ?? []).filter(isOrg)

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { mode: 'new', phone: '', role: 'manager' },
  })

  const addMut = useMutation({
    mutationFn: (body: Record<string, unknown>) => addOrganizer(eventId, body),
    onSuccess: () => {
      toast.success('Organizer added')
      void qc.invalidateQueries({ queryKey: ['event-organizers', eventId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const removeMut = useMutation({
    mutationFn: (oid: number) => removeOrganizer(eventId, oid),
    onSuccess: () => {
      toast.success('Removed')
      void qc.invalidateQueries({ queryKey: ['event-organizers', eventId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onSubmit = (v: Form) => {
    addMut.mutate({
      phone: `232${v.phone}`,
      role: v.role,
      mode: v.mode,
    })
  }

  const columns: TableColumn<OrgRow>[] = [
    { key: 'n', header: 'ORGANIZER', render: (r) => r.name },
    { key: 'e', header: 'EMAIL', render: (r) => r.email },
    { key: 'p', header: 'PHONE', render: (r) => r.phone },
    {
      key: 'r',
      header: 'ROLE',
      render: (r) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            r.role.toLowerCase().includes('creator')
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {r.role}
        </span>
      ),
    },
    { key: 'a', header: 'ASSIGNED AT', render: (r) => r.assigned_at },
    {
      key: 'x',
      header: 'ACTION',
      render: (r) =>
        r.is_creator ? (
          <span className="text-gray-400">-</span>
        ) : (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (confirm('Remove organizer?')) removeMut.mutate(r.id)
            }}
          >
            Remove
          </Button>
        ),
    },
  ]

  if (!Number.isFinite(eventId)) return <p className="text-red-600">Invalid event</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Organizers</h1>
          <p className="text-sm text-gray-600">{event?.title}</p>
        </div>
        <Link to="/events">
          <Button variant="outline">← Back to Events</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Add Organizer</h2>
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <Select
            label="Add New Organizer or Select Existing"
            name="mode"
            options={[
              { value: 'new', label: 'Create New Organizer' },
              { value: 'existing', label: 'Select Existing' },
            ]}
            register={register('mode')}
            required
          />
          <div />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-gray-600">Phone Number *</label>
            <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-brand">
              <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-600">232</span>
              <input
                className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm outline-none"
                placeholder="78672855"
                {...register('phone')}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Enter 8-digit Sierra Leone number</p>
            {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
          </div>
          <Select
            label="Role"
            name="role"
            options={[
              { value: 'manager', label: 'Manager' },
              { value: 'ticketer', label: 'Ticketer' },
              { value: 'scanner_in', label: 'Scanner In' },
              { value: 'scanner_out', label: 'Scanner Out' },
            ]}
            register={register('role')}
            required
          />
          <div className="md:col-span-2">
            <Button type="submit" loading={addMut.isPending}>
              Add Organizer
            </Button>
          </div>
        </form>
      </div>

      {orgQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table columns={columns} data={rows} emptyMessage="No organizers" getRowKey={(r) => r.id} />
      )}
    </div>
  )
}
