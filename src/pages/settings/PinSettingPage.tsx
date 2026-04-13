import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { changePin } from '../../api/settings.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { KeyRound } from 'lucide-react'

const schema = z
  .object({
    current_pin: z.string().min(1),
    pin: z.string().min(4).regex(/^\d+$/, 'Numeric only'),
    confirm_pin: z.string().min(1),
  })
  .refine((d) => d.pin === d.confirm_pin, { message: 'Pins must match', path: ['confirm_pin'] })

type Form = z.infer<typeof schema>

export function PinSettingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => changePin(body),
    onSuccess: () => toast.success('PIN changed successfully'),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <KeyRound className="h-8 w-8 text-brand" />
          <h1 className="text-2xl font-bold text-gray-900">Change Pin</h1>
        </div>
        <form
          onSubmit={(e) => void handleSubmit((v) => mutation.mutate(v))(e)}
          className="space-y-4"
        >
          <Input
            type="password"
            label="Current Pin"
            name="current_pin"
            placeholder="Current Pin"
            register={register('current_pin')}
            required
            error={errors.current_pin?.message}
          />
          <Input
            type="password"
            label="Pin (New Pin)"
            name="pin"
            placeholder="New Pin"
            register={register('pin')}
            required
            error={errors.pin?.message}
          />
          <Input
            type="password"
            label="Confirm Pin"
            name="confirm_pin"
            placeholder="Confirm Pin"
            register={register('confirm_pin')}
            required
            error={errors.confirm_pin?.message}
          />
          <Button type="submit" className="w-full" loading={mutation.isPending}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
