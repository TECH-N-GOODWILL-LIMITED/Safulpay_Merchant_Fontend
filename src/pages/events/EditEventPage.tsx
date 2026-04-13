import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getEvents, updateEvent } from '../../api/events.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  venue: z.string().optional(),
})

type Form = z.infer<typeof schema>

export function EditEventPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    enabled: Number.isFinite(eventId),
  })

  const event = eventsQuery.data?.data?.events?.find((e) => e.id === eventId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        venue: event.venue,
      })
    }
  }, [event, reset])

  const mutation = useMutation({
    mutationFn: (fd: FormData) => updateEvent(eventId, fd),
    onSuccess: () => {
      toast.success('Event updated')
      void qc.invalidateQueries({ queryKey: ['events'] })
      navigate('/events')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const onValid = () => {
    if (!formRef.current) return
    mutation.mutate(new FormData(formRef.current))
  }

  if (!Number.isFinite(eventId)) {
    return <p className="text-sm text-red-600">Invalid event</p>
  }

  if (eventsQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return <p className="text-sm text-gray-600">Event not found</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <Link to="/events">
          <Button variant="outline">← Back</Button>
        </Link>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => void handleSubmit(onValid)(e)}
        className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={eventId} />
        <Input label="Event Title" name="title" register={register('title')} required error={errors.title?.message} />
        <div>
          <label className="mb-1 block text-sm text-gray-600">Description</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            {...register('description')}
          />
        </div>
        <Input label="Venue" name="venue" register={register('venue')} />
        <div>
          <label className="mb-1 block text-sm text-gray-600">Event Image</label>
          <input type="file" name="image" accept="image/*" className="text-sm" />
        </div>
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}
