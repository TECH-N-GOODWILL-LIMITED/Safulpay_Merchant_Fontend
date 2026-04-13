import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createEvent } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  venue: z.string().optional(),
  scan_mode: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
})

type Form = z.infer<typeof schema>

export function CreateEventPage() {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      venue: '',
      scan_mode: 'qr',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (fd: FormData) => createEvent(fd),
    onSuccess: () => {
      toast.success('Event created')
      navigate('/events')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onValid = (_values: Form) => {
    if (!formRef.current) return
    mutation.mutate(new FormData(formRef.current))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
        <Link to="/events">
          <Button variant="outline">← Back</Button>
        </Link>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => void handleSubmit(onValid)(e)}
        className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        encType="multipart/form-data"
      >
        <Input label="Event Title" name="title" register={register('title')} required error={errors.title?.message} />
        <div>
          <label className="mb-1 block text-sm text-gray-600">Description</label>
          <textarea
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            {...register('description')}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Venue" name="venue" register={register('venue')} />
          <div>
            <label className="mb-1 block text-sm text-gray-600">Event Image</label>
            <input id="event-image" type="file" name="image" accept="image/*" className="text-sm" />
            <p className="mt-1 text-xs text-gray-500">Supported: JPG, PNG. Max size: 5MB</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Ticket Template (Optional)</label>
            <input type="file" name="ticket_template" accept="image/*" className="text-sm" />
            <p className="mt-1 text-xs text-gray-500">
              Upload ticket template with black rectangular spot for QR code. JPG, PNG. Max 5MB
            </p>
            <p className="text-xs text-gray-400">PHP Upload Limit: 10MB | Post Max Size: 10MB</p>
          </div>
          <Select
            label="Scan Mode"
            name="scan_mode"
            options={[{ value: 'qr', label: 'QR Mode only' }]}
            register={register('scan_mode')}
            required
          />
          <Input type="date" label="Start Date" name="start_date" register={register('start_date')} required error={errors.start_date?.message} />
          <Input type="date" label="End Date" name="end_date" register={register('end_date')} />
          <Input type="time" label="Start Time" name="start_time" register={register('start_time')} />
          <Input type="time" label="End Time" name="end_time" register={register('end_time')} />
        </div>
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          ℹ Note: Ticket categories and pricing will be configured after event creation.
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          ℹ Organizer: TECH&apos;N GOODWIL LTD <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-700">Creator</span>
          <br />
          This event will be automatically assigned to you as the Creator organizer.
        </div>
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create Event
        </Button>
      </form>
    </div>
  )
}
