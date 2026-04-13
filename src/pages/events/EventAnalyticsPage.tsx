import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getEventAnalytics } from '../../api/events.api'
import { StatCard } from '../../components/ui/StatCard'
import { Spinner } from '../../components/ui/Spinner'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatCurrency } from '../../utils/formatters'

const PIE_COLORS = ['#1B5E38', '#349960', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280']

export function EventAnalyticsPage() {
  const { id } = useParams()
  const eventId = Number(id)

  const q = useQuery({
    queryKey: ['event-analytics', eventId],
    queryFn: () => getEventAnalytics(eventId),
    enabled: Number.isFinite(eventId),
  })

  const d = q.data?.data
  const eventName = d?.event?.title ?? 'Event'

  const breakdown = d?.status_breakdown ?? {}

  const catPerf = d?.category_performance ?? []

  const catColumns: TableColumn<(typeof catPerf)[number]>[] = [
    { key: 'c', header: 'CATEGORY', render: (r) => r.category },
    { key: 'p', header: 'PRICE', render: (r) => String(r.price) },
    { key: 's', header: 'SOLD', render: (r) => <span className="text-green-700">{r.sold}</span> },
    { key: 'a', header: 'AVAILABLE', render: (r) => String(r.available) },
    {
      key: 'rev',
      header: 'REVENUE',
      render: (r) => formatCurrency(r.revenue, 'SLE'),
    },
    { key: 'pr', header: 'PROGRESS', render: (r) => r.progress },
  ]

  if (!Number.isFinite(eventId)) return <p className="text-red-600">Invalid event</p>
  if (q.isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Analytics</h1>
          <p className="text-sm text-gray-600">{eventName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/events/${eventId}/tickets`}>
            <span className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover">
              View Tickets
            </span>
          </Link>
          <Link to="/events">
            <span className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
              ← Back to Events
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          color="green"
          title="Tickets Sold"
          value={d?.tickets_sold ?? 0}
          subtitle={d?.tickets_total_percent ?? ''}
        />
        <StatCard
          color="green"
          title="Total Revenue"
          value={formatCurrency(d?.total_revenue ?? 0, 'SLE')}
          subtitle={`Avg: ${formatCurrency(d?.avg_per_ticket ?? 0, 'SLE')}/ticket`}
        />
        <StatCard
          color="blue"
          title="Scanned Tickets"
          value={d?.scanned ?? 0}
          subtitle={d?.attendance_rate ?? ''}
        />
        <StatCard
          color="yellow"
          title="Unique Buyers"
          value={d?.unique_buyers ?? 0}
          subtitle={d?.tickets_per_buyer ?? ''}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {['Active', 'Inside', 'Outside', 'Available', 'Invalidated', 'Total'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-white p-3 text-center text-sm shadow-sm"
          >
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-lg font-bold text-brand">
              {breakdown[label.toLowerCase()] ?? breakdown[label] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Sales Over Time</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d?.sales_over_time ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1B5E38" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Revenue by Category</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={d?.revenue_by_category ?? []} dataKey="value" nameKey="name" outerRadius={90}>
                  {(d?.revenue_by_category ?? []).map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Category Performance</h2>
        <Table
          columns={catColumns}
          data={catPerf}
          emptyMessage="No categories"
          getRowKey={(r) => r.category}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800">Performance Metrics</h3>
          <p className="mt-2 text-sm text-gray-600">
            Avg Ticket Price: {formatCurrency(d?.performance?.avg_price ?? 0, 'SLE')}
          </p>
          <p className="text-sm text-gray-600">
            Best Category: {d?.performance?.best_category ?? '-'}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800">Peak Sales Times</h3>
          <p className="mt-2 text-sm text-gray-600">Peak Hour: {d?.peak?.hour ?? '-'}</p>
          <p className="text-sm text-gray-600">Peak Day: {d?.peak?.day ?? '-'}</p>
          <p className="text-sm text-gray-600">Sales Velocity: {d?.peak?.velocity ?? '-'}</p>
          <p className="text-sm text-gray-600">Attendance Rate: {d?.peak?.attendance ?? '-'}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800">Event Timeline</h3>
          <p className="mt-2 text-sm text-brand">
            Days Since Start: {d?.timeline?.days_since_start ?? '-'}
          </p>
          <p className="text-sm text-gray-600">Start Date: {d?.timeline?.start ?? '-'}</p>
          <p className="text-sm text-gray-600">End Date: {d?.timeline?.end ?? '-'}</p>
          <p className="text-sm text-brand">
            Projected Revenue: {formatCurrency(d?.timeline?.projected_revenue ?? 0, 'SLE')}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Revenue by Currency</h2>
        <Table
          columns={[
            { key: 'c', header: 'CURRENCY', render: (r) => r.currency },
            { key: 't', header: 'TICKETS', render: (r) => String(r.tickets) },
            { key: 'a', header: 'AMOUNT', render: (r) => String(r.amount) },
          ]}
          data={d?.revenue_by_currency ?? []}
          emptyMessage="No data"
          getRowKey={(r) => r.currency}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Recent Sales</h2>
        <Table
          columns={[
            { key: 'tk', header: 'TICKET', render: (r) => <span className="font-mono">{r.ticket}</span> },
            { key: 'b', header: 'BUYER', render: (r) => r.buyer },
            { key: 'a', header: 'AMOUNT', render: (r) => formatCurrency(r.amount, 'SLE') },
            { key: 't', header: 'TIME', render: (r) => r.time },
          ]}
          data={d?.recent_sales ?? []}
          emptyMessage="No recent sales"
          getRowKey={(r, i) => `${r.ticket}-${i}`}
        />
      </div>
    </div>
  )
}
