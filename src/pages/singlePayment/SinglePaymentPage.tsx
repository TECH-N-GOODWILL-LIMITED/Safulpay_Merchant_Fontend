import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitSinglePayment } from '../../api/singlePayment.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { SERVICE_TYPE_OPTIONS } from '../../constants/options'

const schema = z.object({
  recipient_name: z.string().min(1),
  account_detail: z.string().min(1),
  service_slug: z.string().min(1),
  amount: z.coerce.number().min(1),
})

type Form = z.infer<typeof schema>

export function SinglePaymentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => submitSinglePayment(body),
    onSuccess: () => toast.success('Payment submitted'),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onSubmit = (v: Form) => mutation.mutate({ ...v })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Send className="h-8 w-8 text-brand" />
          <h1 className="text-2xl font-bold text-gray-900">Single Payment</h1>
        </div>
        <Link to="/single-payment/history">
          <Button variant="secondary">Payment History</Button>
        </Link>
      </div>
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
        ℹ Make a single payment to any recipient. The payment will be processed immediately after KYC
        validation.
      </div>
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <Input
          label="Recipient Full Name"
          name="recipient_name"
          placeholder="Enter recipient full name"
          register={register('recipient_name')}
          required
          error={errors.recipient_name?.message}
        />
        <p className="text-xs text-gray-500">Must match KYC name for validation</p>
        <Input
          label="Account Detail (Phone/Account)"
          name="account_detail"
          placeholder="e.g. 23278123456"
          register={register('account_detail')}
          required
          error={errors.account_detail?.message}
        />
        <Select
          label="Service Type"
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
          placeholder="Enter amount"
          register={register('amount')}
          required
          error={errors.amount?.message}
        />
        <p className="text-xs text-gray-500">Minimum: 1.00</p>
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          ⚠ Note: The payment will be validated via KYC before processing. Amount will be deducted
          from your wallet balance.
        </div>
        <Button type="submit" className="w-full gap-2" loading={mutation.isPending}>
          <Send className="h-4 w-4" />
          Submit Payment
        </Button>
      </form>
    </div>
  )
}
