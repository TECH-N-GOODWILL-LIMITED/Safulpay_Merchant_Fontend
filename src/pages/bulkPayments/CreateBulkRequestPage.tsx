import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createBulkRequest, getMembers } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { GroupMember } from '../../types'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import type { TableColumn } from '../../components/ui/Table'
import { formatCurrency } from '../../utils/formatters'

export function CreateBulkRequestPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const qc = useQueryClient()
  const [notes, setNotes] = useState('')

  const membersQuery = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => getMembers(groupId),
    enabled: Number.isFinite(groupId),
  })

  const members = membersQuery.data?.data?.members ?? []

  const totalAmount = members.reduce((s: number, m: GroupMember) => s + m.amount, 0)
  const totalCharges = members.length * 0.18

  const mutation = useMutation({
    mutationFn: () => createBulkRequest(groupId, { notes }),
    onSuccess: () => {
      toast.success('Bulk request created')
      void qc.invalidateQueries({ queryKey: ['request-log', groupId] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const columns: TableColumn<GroupMember>[] = [
    { key: 'n', header: 'FULL NAME', render: (r) => r.full_name },
    { key: 'k', header: 'KYC NAME', render: (r) => r.kyc_name },
    { key: 'a', header: 'ACCOUNT DETAIL', render: (r) => r.account_detail },
    { key: 's', header: 'SERVICE', render: (r) => r.service_slug },
    { key: 'am', header: 'AMOUNT', render: (r) => formatCurrency(r.amount, r.currency) },
    { key: 'ch', header: 'CHARGES', render: () => '0.18' },
    { key: 'st', header: 'STATUS', render: (r) => r.status },
    { key: 'ty', header: 'TYPE', render: () => 'standard' },
  ]

  if (!Number.isFinite(groupId)) return <p className="text-red-600">Invalid group</p>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Bulk Request</h1>
        <p className="text-sm text-gray-600">Group ID: {groupId}</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800">
          Members for Bulk Request — {members.length} Member(s)
        </h2>
        <div className="mt-4">
          <Table columns={columns} data={members} loading={membersQuery.isLoading} emptyMessage="No members" getRowKey={(r) => r.id} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Create Bulk Disbursement Request</h2>
        <label className="mt-4 block text-sm text-gray-600">Notes (Optional)</label>
        <textarea
          value={notes}
          maxLength={1000}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-gray-400">{notes.length}/1000</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Members', String(members.length)],
          ['Validated Members', String(members.length)],
          ['Override Members', '0'],
          ['Total Selected', String(members.length)],
          ['Current Amount', formatCurrency(totalAmount, 'SLE')],
          ['Total Charges', formatCurrency(totalCharges, 'SLE')],
          ['Total Amount (Including Charges)', formatCurrency(totalAmount + totalCharges, 'SLE')],
          ['Average Charge per Member', formatCurrency(totalCharges / Math.max(members.length, 1), 'SLE')],
          ['KYC Validated', '100%'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-100 bg-white p-4 text-sm shadow-sm">
            <p className="text-gray-500">{k}</p>
            <p className="mt-1 font-semibold text-gray-900">{v}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Link to={`/bulk-payments/${groupId}/members`} className="flex-1">
          <Button variant="secondary" className="w-full">
            ← Back to Members
          </Button>
        </Link>
        <Button className="flex-1" loading={mutation.isPending} onClick={() => mutation.mutate()}>
          Create Bulk Request
        </Button>
      </div>
    </div>
  )
}
