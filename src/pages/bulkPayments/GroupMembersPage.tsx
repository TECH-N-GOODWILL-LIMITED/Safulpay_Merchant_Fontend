import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getGroups, getMembers, removeMember } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { GroupMember } from '../../types'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { User as UserIcon } from 'lucide-react'

async function loadGroupName(id: number) {
  const r = await getGroups()
  const list = (r.data?.groups ?? []) as Array<{ id: number; name: string }>
  return list.find((g: { id: number; name: string }) => g.id === id)?.name ?? 'Group'
}

export function GroupMembersPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const qc = useQueryClient()

  const nameQuery = useQuery({
    queryKey: ['group-name', groupId],
    queryFn: () => loadGroupName(groupId),
    enabled: Number.isFinite(groupId),
  })

  const membersQuery = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => getMembers(groupId),
    enabled: Number.isFinite(groupId),
  })

  const removeMut = useMutation({
    mutationFn: (memberId: number) => removeMember(groupId, memberId),
    onSuccess: () => {
      toast.success('Member removed')
      void qc.invalidateQueries({ queryKey: ['group-members', groupId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const columns: TableColumn<GroupMember>[] = [
    {
      key: 'm',
      header: 'MEMBER',
      render: (r) => (
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-brand" />
          <div>
            <p className="font-semibold">{r.full_name}</p>
            <p className="text-xs text-gray-500">ID: #{r.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kyc',
      header: 'KYC INFO',
      render: (r) => (
        <div>
          <p className="text-green-700">✓ {r.kyc_name}</p>
          <p className="text-xs text-gray-500">KYC Verified Name</p>
        </div>
      ),
    },
    {
      key: 'svc',
      header: 'SERVICE',
      render: (r) => (
        <span className="rounded-full bg-gray-900 px-2 py-0.5 font-mono text-xs text-white">
          {r.service_slug}
        </span>
      ),
    },
    {
      key: 'amt',
      header: 'AMOUNT',
      render: (r) => formatCurrency(r.amount, r.currency),
    },
    {
      key: 'add',
      header: 'ADDED',
      render: (r) => formatDate(r.added_at),
    },
    {
      key: 'act',
      header: 'ACTION',
      render: (r) => (
        <div className="flex gap-2">
          <Link to={`/bulk-payments/${groupId}/members/${r.id}/edit`}>
            <Button size="sm" variant="outline" className="!text-blue-600">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (confirm('Remove member?')) removeMut.mutate(r.id)
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (!Number.isFinite(groupId)) return <p className="text-red-600">Invalid group</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Members of {nameQuery.data ?? '…'}
        </h1>
        <div className="flex gap-2">
          <Link to={`/bulk-payments/${groupId}/members/add`}>
            <Button>Add Member</Button>
          </Link>
          <Link to="/bulk-payments">
            <Button variant="outline">Back to Groups</Button>
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        data={membersQuery.data?.data?.members ?? []}
        loading={membersQuery.isLoading}
        emptyMessage="No members"
        getRowKey={(r) => r.id}
      />
    </div>
  )
}
