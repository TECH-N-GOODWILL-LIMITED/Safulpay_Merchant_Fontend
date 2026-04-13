import axiosInstance from './axiosInstance'
import {
  mockCreateEventResponse,
  mockEventAnalytics,
  mockEventCategories,
  mockEventOrganizers,
  mockEventTickets,
  mockEventsList,
} from '../mock/events.mock'
import { mockDelay } from '../mock/delay'
import type { Event, EventAnalyticsData } from '../types'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function getEvents() {
  if (USE_MOCK) {
    await mockDelay(450)
    return mockEventsList
  }
  const { data } = await axiosInstance.get<typeof mockEventsList>('/merchant/events')
  return data
}

export async function createEvent(formData: FormData) {
  if (USE_MOCK) {
    await mockDelay(700)
    void formData
    return mockCreateEventResponse
  }
  const { data } = await axiosInstance.post<typeof mockCreateEventResponse>(
    '/merchant/events/create',
    formData
  )
  return data
}

export async function updateEvent(id: number, formData: FormData) {
  if (USE_MOCK) {
    await mockDelay(600)
    void formData
    return { status: true, data: { event: mockEventsList.data.events.find((e) => e.id === id) } }
  }
  const { data } = await axiosInstance.post(`/merchant/events/${id}/edit`, formData)
  return data
}

export async function deleteEvent(id: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    return
  }
  await axiosInstance.delete(`/merchant/events/${id}`)
}

export async function getEventAnalytics(id: number) {
  if (USE_MOCK) {
    await mockDelay(500)
    void id
    return {
      status: true as const,
      data: mockEventAnalytics as EventAnalyticsData & { event?: Event },
    }
  }
  const { data } = await axiosInstance.get<{ status: boolean; data: EventAnalyticsData }>(
    `/merchant/events/${id}/analytics`
  )
  return data
}

export async function getEventPublicUrl(id: number) {
  if (USE_MOCK) {
    await mockDelay(300)
    const ev = mockEventsList.data.events.find((e) => e.id === id)
    return {
      status: true as const,
      data: { url: ev?.public_url ?? 'https://app.safulpay.com/e/demo' },
    }
  }
  const { data } = await axiosInstance.get<{ status: boolean; data: { url: string } }>(
    `/merchant/events/${id}/public-url`
  )
  return data
}

export async function getCategories(id: number) {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    return mockEventCategories
  }
  const { data } = await axiosInstance.get(`/merchant/events/${id}/categories`)
  return data
}

export async function addCategory(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void id
    return { status: true, data: body }
  }
  const { data } = await axiosInstance.post(`/merchant/events/${id}/categories`, body)
  return data
}

export async function getOrganizers(id: number) {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    return mockEventOrganizers
  }
  const { data } = await axiosInstance.get(`/merchant/events/${id}/organizers`)
  return data
}

export async function addOrganizer(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void id
    return { status: true, data: body }
  }
  const { data } = await axiosInstance.post(`/merchant/events/${id}/organizers`, body)
  return data
}

export async function removeOrganizer(id: number, organizerId: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    void organizerId
    return
  }
  await axiosInstance.delete(`/merchant/events/${id}/organizers/${organizerId}`)
}

export async function getTickets(id: number, params?: Record<string, string | number | undefined>) {
  if (USE_MOCK) {
    await mockDelay(450)
    void id
    void params
    return mockEventTickets
  }
  const { data } = await axiosInstance.get(`/merchant/events/${id}/tickets`, { params })
  return data
}

export async function sellTicket(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(600)
    void id
    return { status: true, data: { ok: true, ...body } }
  }
  const { data } = await axiosInstance.post(`/merchant/events/${id}/tickets/sell`, body)
  return data
}

export async function printTickets(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(800)
    void id
    void body
    return { status: true, data: { job_id: 'print-mock-1' } }
  }
  const { data } = await axiosInstance.post(`/merchant/events/${id}/tickets/print`, body)
  return data
}
