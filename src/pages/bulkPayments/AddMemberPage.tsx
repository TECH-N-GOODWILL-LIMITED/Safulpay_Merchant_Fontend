import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { addMember } from '../../api/bulkPayments.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { SERVICE_TYPE_OPTIONS } from '../../constants/options'

const schema = z.object({
  full_name: z.string().min(1),
  account_detail: z.string().min(1),
  service_slug: z.string().min(1),
  amount: z.coerce.number().min(0.01),
})

type Form = z.infer<typeof schema>

export function AddMemberPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => addMember(groupId, body),
    onSuccess: () => {
      toast.success('Member added')
      void qc.invalidateQueries({ queryKey: ['group-members', groupId] })
      navigate(`/bulk-payments/${groupId}/members`)
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  if (!Number.isFinite(groupId)) return <p className="text-red-600">Invalid group</p>

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add Member</h1>
        <Link to={`/bulk-payments/${groupId}/members`} className="text-sm text-brand hover:underline">
          ← Back
        </Link>
      </div>
      <form
        onSubmit={(e) => void handleSubmit((v) => mutation.mutate(v))(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <Input
          label="Full Name"
          name="full_name"
          register={register('full_name')}
          required
          error={errors.full_name?.message}
        />
        <Input
          label="Account Detail"
          name="account_detail"
          register={register('account_detail')}
          required
          error={errors.account_detail?.message}
        />
        <Select
          label="Service Slug"
          name="service_slug"
          options={SERVICE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          register={register('service_slug')}
          required
        />
        <Input
          type="number"
          step="0.01"
          label="Amount"
          name="amount"
          register={register('amount')}
          required
          error={errors.amount?.message}
        />
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Add Member
        </Button>
        <Button type="button" variant="secondary" className="w-full">
          Bulk Upload Members
        </Button>
      </form>
    </div>
  )
}
