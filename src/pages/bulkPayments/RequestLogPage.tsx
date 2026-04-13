import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { getGroups, getRequestLog } from '../../api/bulkPayments.api'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatDate } from '../../utils/formatters'
import type { BulkRequestLogRow } from '../../types'

async function loadGroupName(id: number) {
  const r = await getGroups()
  const list = (r.data?.groups ?? []) as Array<{ id: number; name: string }>
  return list.find((g: { id: number; name: string }) => g.id === id)?.name ?? 'Group'
}

export function RequestLogPage() {
  const { id } = useParams()
  const groupId = Number(id)

  const nameQuery = useQuery({
    queryKey: ['group-name', groupId],
    queryFn: () => loadGroupName(groupId),
    enabled: Number.isFinite(groupId),
  })

  const logQuery = useQuery({
    queryKey: ['request-log', groupId],
    queryFn: () => getRequestLog(groupId),
    enabled: Number.isFinite(groupId),
  })

  const rows = (logQuery.data?.data?.requests ?? []) as BulkRequestLogRow[]

  const columns: TableColumn<BulkRequestLogRow>[] = [
    {
      key: 'tag',
      header: 'REQUEST TAG',
      render: (r) => (
        <span className="flex items-center gap-2 font-mono text-sm">
          <FileText className="h-4 w-4 text-brand" />
          {r.tag}
        </span>
      ),
    },
    {
      key: 'g',
      header: 'GROUP NAME',
      render: (r) => (
        <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{r.group_name}</span>
      ),
    },
    {
      key: 'd',
      header: 'DATE CREATED',
      render: (r) => formatDate(r.created_at),
    },
    {
      key: 'a',
      header: 'ACTIONS',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Done</span>
          <Link to={`/bulk-payments/${groupId}/request/${r.tag}`}>
            <Button size="sm" variant="outline" className="!text-blue-600">
              View
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  if (!Number.isFinite(groupId)) return <p className="text-red-600">Invalid group</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Request Log for {nameQuery.data ?? '…'}
        </h1>
        <div className="flex gap-2">
          <Link to={`/bulk-payments/${groupId}/request/create`}>
            <Button>New Request</Button>
          </Link>
          <Link to="/bulk-payments">
            <Button variant="outline">Back to Groups</Button>
          </Link>
        </div>
      </div>
      <Table columns={columns} data={rows} loading={logQuery.isLoading} emptyMessage="No requests" getRowKey={(r) => r.tag} />
    </div>
  )
}
