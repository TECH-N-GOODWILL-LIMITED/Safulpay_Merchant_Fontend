import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMembers, updateMember } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import type { GroupMember } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { SERVICE_TYPE_OPTIONS } from '../../constants/options'

const schema = z.object({
  full_name: z.string().min(1),
  account_detail: z.string().min(1),
  service_slug: z.string().min(1),
  amount: z.coerce.number().min(0),
  status: z.enum(['pending', 'active', 'requested', 'completed', 'failed']),
})

type Form = z.infer<typeof schema>

export function EditMemberPage() {
  const { id, memberId } = useParams()
  const groupId = Number(id)
  const mid = Number(memberId)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const membersQuery = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => getMembers(groupId),
    enabled: Number.isFinite(groupId),
  })

  const member = (membersQuery.data?.data?.members as GroupMember[] | undefined)?.find(
    (m: GroupMember) => m.id === mid
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (member) {
      reset({
        full_name: member.full_name,
        account_detail: member.account_detail,
        service_slug: member.service_slug,
        amount: member.amount,
        status: member.status,
      })
    }
  }, [member, reset])

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => updateMember(groupId, mid, body),
    onSuccess: () => {
      toast.success('Member updated')
      void qc.invalidateQueries({ queryKey: ['group-members', groupId] })
      navigate(`/bulk-payments/${groupId}/members`)
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  if (!Number.isFinite(groupId) || !Number.isFinite(mid)) {
    return <p className="text-red-600">Invalid</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Member</h1>
        <p className="text-sm text-gray-600">Group member #{mid}</p>
      </div>
      <form
        onSubmit={(e) => void handleSubmit((v) => mutation.mutate(v))(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <Input label="Full Name" name="full_name" register={register('full_name')} required error={errors.full_name?.message} />
        <Input label="Account Detail" name="account_detail" register={register('account_detail')} required />
        <Select
          label="Service Slug"
          name="service_slug"
          options={SERVICE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          register={register('service_slug')}
          required
        />
        <Input type="number" step="0.01" label="Amount" name="amount" register={register('amount')} required />
        <Select
          label="Status"
          name="status"
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'active', label: 'Active' },
            { value: 'requested', label: 'Requested' },
            { value: 'completed', label: 'Completed' },
            { value: 'failed', label: 'Failed' },
          ]}
          register={register('status')}
          required
        />
        {member ? (
          <p className="text-sm text-gray-600">Created: {member.added_at}</p>
        ) : null}
        <div className="flex gap-2">
          <Link className="flex-1" to={`/bulk-payments/${groupId}/members`}>
            <Button variant="secondary" className="w-full" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="flex-1" loading={mutation.isPending}>
            Update Member
          </Button>
        </div>
      </form>

      {member ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800">Member Information</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p className="text-gray-500">Member ID</p>
            <p>{member.id}</p>
            <p className="text-gray-500">KYC Name</p>
            <p>{member.kyc_name}</p>
            <p className="text-gray-500">Status</p>
            <Badge status={member.status === 'completed' ? 'completed' : 'pending'}>{member.status}</Badge>
            <p className="text-gray-500">KYC</p>
            <p className="text-green-700">{member.kyc_validated ? 'Verified' : 'Not verified'}</p>
            <p className="text-gray-500">Amount</p>
            <p>{member.amount}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
