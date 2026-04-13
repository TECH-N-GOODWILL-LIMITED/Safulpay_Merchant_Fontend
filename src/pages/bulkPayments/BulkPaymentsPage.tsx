import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, ScrollText, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { createGroup, exportGroups, getGroups, updateGroup } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { DisbursementGroup } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters'

export function BulkPaymentsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [editGroup, setEditGroup] = useState<DisbursementGroup | null>(null)
  const [editName, setEditName] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const q = useQuery({ queryKey: ['disbursement-groups'], queryFn: () => getGroups() })

  const rows = ((q.data?.data?.groups ?? []) as DisbursementGroup[]).filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const exportMut = useMutation({
    mutationFn: exportGroups,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'groups.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const updateMut = useMutation({
    mutationFn: () => updateGroup(editGroup!.id, { name: editName }),
    onSuccess: () => {
      toast.success('Updated')
      setEditGroup(null)
      void qc.invalidateQueries({ queryKey: ['disbursement-groups'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const createMut = useMutation({
    mutationFn: () => createGroup({ name: newName, description: newDesc }),
    onSuccess: () => {
      toast.success('Group created')
      setCreateOpen(false)
      setNewName('')
      setNewDesc('')
      void qc.invalidateQueries({ queryKey: ['disbursement-groups'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const columns: TableColumn<DisbursementGroup>[] = [
    {
      key: 'cb',
      header: '',
      render: () => <input type="checkbox" className="rounded border-gray-300" readOnly />,
    },
    {
      key: 'name',
      header: 'GROUP NAME',
      render: (r) => (
        <div>
          <p className="flex items-center gap-2 font-semibold text-gray-900">
            <Users className="h-4 w-4 text-brand" />
            {r.name}
          </p>
          <p className="text-xs text-gray-500">ID: #{r.id}</p>
        </div>
      ),
    },
    {
      key: 'desc',
      header: 'DESCRIPTION',
      render: (r) => <span className="line-clamp-2 text-sm">{r.description}</span>,
    },
    {
      key: 'mem',
      header: 'MEMBERS',
      render: (r) => (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
          {r.members_count} Member(s)
        </span>
      ),
    },
    {
      key: 'req',
      header: 'REQUESTS',
      render: (r) => (
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
          {r.requests_count} Request(s)
        </span>
      ),
    },
    {
      key: 'ok',
      header: 'SUCCESSFUL',
      render: (r) => (
        <div className="text-xs">
          <p className="font-semibold text-gray-900">
            {formatCurrency(r.successful.amount, r.successful.currency)}
          </p>
          <p className="text-gray-500">
            {formatCurrency(r.successful.base_amount, r.successful.currency)} +{' '}
            {formatCurrency(r.successful.charges, r.successful.currency)} charges
          </p>
          <p className="text-gray-500">{r.successful.transactions} transactions</p>
        </div>
      ),
    },
    {
      key: 'fail',
      header: 'FAILED',
      render: (r) => (
        <div className="text-xs">
          <p>{formatCurrency(r.failed.amount, r.failed.currency)}</p>
          <p className="text-gray-500">{r.failed.transactions} transactions</p>
        </div>
      ),
    },
    {
      key: 'created',
      header: 'CREATED',
      render: (r) => (
        <div>
          <p className="text-sm">{formatDate(r.created_at)}</p>
          <p className="text-xs text-gray-500">{formatRelativeTime(r.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'act',
      header: 'ACTION',
      render: (r) => (
        <div className="flex gap-1">
          <Link to={`/bulk-payments/${r.id}/members`}>
            <Button size="sm" className="!bg-teal-600 !px-2 !text-white">
              <Users className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/bulk-payments/${r.id}/request-log`}>
            <Button size="sm" className="!bg-gray-900 !px-2 !text-white">
              <ScrollText className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            className="!bg-amber-500 !px-2 !text-white"
            onClick={() => {
              setEditGroup(r)
              setEditName(r.name)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Disbursement Groups</h1>
        <div className="flex flex-wrap gap-2">
          <Input
            name="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={() => exportMut.mutate()} loading={exportMut.isPending}>
            Export
          </Button>
          <Button onClick={() => setCreateOpen(true)}>+ Add Group</Button>
        </div>
      </div>
      <Table columns={columns} data={rows} loading={q.isLoading} emptyMessage="No groups" getRowKey={(r) => r.id} />

      <Modal
        isOpen={!!editGroup}
        onClose={() => setEditGroup(null)}
        title="Edit Group"
      >
        <Input label="Name" name="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEditGroup(null)}>
            Cancel
          </Button>
          <Button loading={updateMut.isPending} onClick={() => editGroup && updateMut.mutate()}>
            Save
          </Button>
        </div>
      </Modal>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Group">
        <Input label="Group name" name="newName" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <div className="mt-3">
          <label className="mb-1 block text-sm text-gray-600">Description</label>
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button loading={createMut.isPending} onClick={() => createMut.mutate()}>
            Create
          </Button>
        </div>
      </Modal>
    </div>
  )
}
