import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { login } from '../../api/auth.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

const schema = z.object({
  phone_number: z
    .string()
    .min(8, 'Enter 8 digits')
    .max(8, 'Enter 8 digits')
    .regex(/^\d+$/, 'Digits only'),
  pin: z.string().min(4, 'Pin must be at least 4 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { phone_number: '', pin: '' } })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => login(values.phone_number, '+232', values.pin),
    onSuccess: (res) => {
      setAuth(res.data.token, res.data.user)
      toast.success('Welcome back')
      navigate('/dashboard', { replace: true })
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err))
    },
  })

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-2 text-brand">
            <Sprout className="h-10 w-10" />
            <span className="text-3xl font-bold">SafulPay</span>
          </div>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Phone Number *</label>
              <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-brand">
                <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-600">+232</span>
                <input
                  placeholder="78057664"
                  className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm outline-none"
                  {...register('phone_number')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter 8 digits only, +232 will be added automatically
              </p>
              {errors.phone_number ? (
                <p className="mt-1 text-xs text-red-500">{errors.phone_number.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Pin Code *</label>
              <input
                type="password"
                placeholder="Enter pin"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand"
                {...register('pin')}
              />
              {errors.pin ? <p className="mt-1 text-xs text-red-500">{errors.pin.message}</p> : null}
            </div>
            <Button type="submit" className="h-12 w-full !text-base" loading={mutation.isPending}>
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="relative hidden min-h-[40vh] flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-800" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-40" />
        <div className="relative flex h-full items-end p-10 text-white">
          <p className="max-w-sm text-lg font-medium drop-shadow">
            Secure merchant tools for Sierra Leone — wallets, payouts, events, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
