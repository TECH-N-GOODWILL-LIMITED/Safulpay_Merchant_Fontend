import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createPaymentLink } from '../../api/paymentLinks.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'

const schema = z.object({
  amount: z.string().optional(),
  type: z.enum(['one_time', 'continuous']),
  note: z.string().optional(),
})

type Form = z.infer<typeof schema>

export function CreatePaymentLinkPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { amount: '', type: 'one_time', note: '' },
  })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => createPaymentLink(body),
    onSuccess: () => {
      toast.success('Link created')
      void qc.invalidateQueries({ queryKey: ['payment-links'] })
      navigate('/payment-links')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onSubmit = (v: Form) => {
    mutation.mutate({
      amount: v.amount && v.amount.trim() !== '' ? Number(v.amount) : null,
      type: v.type,
      note: v.note,
    })
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create Payment Link</h1>
        <Link to="/payment-links" className="text-sm font-medium text-brand hover:underline">
          ← Back to Links
        </Link>
      </div>
      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        ℹ Create a payment link that customers can use to send you money. You can specify a fixed
        amount and account, or leave them blank for flexibility.
      </div>
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <Input
          type="number"
          step="0.01"
          label="Amount (Optional)"
          name="amount"
          placeholder="Enter amount"
          register={register('amount')}
          error={errors.amount?.message}
        />
        <p className="text-xs text-gray-500">Leave blank to accept any amount</p>
        <Select
          label="Link Type"
          name="type"
          options={[
            { value: 'one_time', label: 'One-time (Single use)' },
            { value: 'continuous', label: 'Continuous (Multiple use)' },
          ]}
          register={register('type')}
          required
        />
        <p className="text-xs text-gray-500">One-time links expire after first use</p>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Note / Description (Optional)</label>
          <textarea
            rows={3}
            placeholder="e.g., Payment for invoice #123"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            {...register('note')}
          />
          <p className="mt-1 text-xs text-gray-500">Add a description for this payment link</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          ℹ Note: Payment links accept payments from any account. Leave amount blank for maximum
          flexibility.
        </div>
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create Payment Link
        </Button>
      </form>
    </div>
  )
}
