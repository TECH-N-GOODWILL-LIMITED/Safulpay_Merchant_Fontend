import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getProfile, updateProfile } from '../../api/settings.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
})

type Form = z.infer<typeof schema>

export function ProfileSettingPage() {
  const qc = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const p = profileQuery.data?.data
    if (p) {
      reset({
        first_name: p.first_name ?? '',
        last_name: p.last_name ?? '',
        address: p.address ?? '',
        state: p.state ?? '',
        zip: p.zip ?? '',
        city: p.city ?? '',
      })
    }
  }, [profileQuery.data, reset])

  const mutation = useMutation({
    mutationFn: (fd: FormData) => updateProfile(fd),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      void qc.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onValid = () => {
    if (!formRef.current) return
    mutation.mutate(new FormData(formRef.current))
  }

  const p = profileQuery.data?.data

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">{p?.business_name ?? 'Merchant'}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>👤 Username: {p?.username ?? 'techengood'}</li>
          <li>✉ Email: {p?.email ?? '—'}</li>
          <li>📱 Mobile: {p?.mobile ?? '—'}</li>
          <li>🌍 Country: {p?.country ?? 'Sierra Leone'}</li>
        </ul>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Profile Setting</h2>
        {profileQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={(e) => void handleSubmit(onValid)(e)}
            className="mt-4 space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First Name"
                name="first_name"
                register={register('first_name')}
                required
                error={errors.first_name?.message}
              />
              <Input
                label="Last Name"
                name="last_name"
                register={register('last_name')}
                required
                error={errors.last_name?.message}
              />
            </div>
            <Input label="Address" name="address" register={register('address')} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="State" name="state" register={register('state')} />
              <Input label="Zip Code" name="zip" register={register('zip')} />
            </div>
            <Input label="City" name="city" register={register('city')} />
            <div>
              <label className="mb-1 block text-sm text-gray-600">Profile Image</label>
              <input type="file" name="profile_image" accept="image/*" className="text-sm" />
              <p className="text-xs text-gray-500">Image size 350x300</p>
            </div>
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
