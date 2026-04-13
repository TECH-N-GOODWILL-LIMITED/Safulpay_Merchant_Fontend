import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BarChart3,
  Copy,
  ExternalLink,
  Pencil,
  Share2,
  Tag,
  Trash2,
  Users,
  Monitor,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  deleteEvent,
  getEventPublicUrl,
  getEvents,
} from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { Event } from '../../types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { Spinner } from '../../components/ui/Spinner'
export function EventsPage() {
  const qc = useQueryClient()
  const [publicModal, setPublicModal] = useState<Event | null>(null)
  const [publicUrl, setPublicUrl] = useState('')

  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: getEvents })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      toast.success('Event deleted')
      void qc.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const openPublic = async (ev: Event) => {
    setPublicModal(ev)
    try {
      const res = await getEventPublicUrl(ev.id)
      setPublicUrl(res.data?.url || ev.public_url)
    } catch {
      setPublicUrl(ev.public_url)
    }
  }

  const copyUrl = () => {
    void navigator.clipboard.writeText(publicUrl)
    toast.success('Copied')
  }

  const columns: TableColumn<Event>[] = [
    {
      key: 'event',
      header: 'EVENT',
      render: (row) => (
        <div className="flex gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt="" className="h-14 w-20 rounded-lg object-cover" />
          ) : (
            <div className="h-14 w-20 rounded-lg bg-gray-100" />
          )}
          <div>
            <p className="font-semibold text-gray-900">{row.title}</p>
            <p className="line-clamp-2 text-xs text-gray-500">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'organizer',
      header: 'ORGANIZER',
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.organizer.name}</p>
          <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
            {row.organizer.role}
          </span>
        </div>
      ),
    },
    {
      key: 'venue',
      header: 'VENUE',
      render: (row) => <span className="text-sm">{row.venue}</span>,
    },
    {
      key: 'datetime',
      header: 'DATE & TIME',
      render: (row) => (
        <div className="text-xs text-gray-600">
          <p>
            Start: {row.start_date} {row.start_time}
          </p>
          <p>End: {row.end_date}</p>
        </div>
      ),
    },
    {
      key: 'tickets',
      header: 'TICKETS',
      render: (row) => (
        <div className="text-xs text-gray-600">
          <p>Categories: {row.tickets.categories}</p>
          <p>Sold: {row.tickets.sold}</p>
          <p>{row.tickets.max_tickets == null ? 'Unlimited' : `Max: ${row.tickets.max_tickets}`}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => (
        <Badge status={row.status === 'active' ? 'active' : 'inactive'}>{row.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'ACTION',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            className="!bg-brand !px-2"
            onClick={() => void openPublic(row)}
            title="Public"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Link to={`/events/${row.id}/analytics`}>
            <Button size="sm" variant="outline" className="!px-2" title="Analytics">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/events/${row.id}/categories`}>
            <Button size="sm" className="!bg-amber-500 !px-2 !text-white hover:!bg-amber-600">
              <Tag className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/events/${row.id}/organizers`}>
            <Button size="sm" variant="secondary" className="!px-2">
              <Users className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/events/${row.id}/tickets`}>
            <Button size="sm" className="!bg-gray-900 !px-2 !text-white">
              <Monitor className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/events/${row.id}/edit`}>
            <Button size="sm" className="!bg-blue-600 !px-2 !text-white hover:!bg-blue-700">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            className="!px-2"
            onClick={() => {
              if (confirm('Delete this event?')) deleteMut.mutate(row.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <Link to="/events/create">
          <Button>+ Create Event</Button>
        </Link>
      </div>
      {eventsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={eventsQuery.data?.data?.events ?? []}
          emptyMessage="No events yet"
          getRowKey={(row) => row.id}
        />
      )}

      <Modal
        isOpen={!!publicModal}
        onClose={() => setPublicModal(null)}
        title="Public Event Page"
        size="lg"
      >
        <p className="text-sm text-gray-600">
          Share this link with customers to allow them to purchase tickets online:
        </p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={publicUrl}
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
          <Button variant="outline" onClick={copyUrl}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={publicUrl} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Page
            </Button>
          </a>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={copyUrl}
          >
            Share
          </Button>
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          Customers can browse event details and purchase tickets directly from this page.
        </div>
      </Modal>
    </div>
  )
}
