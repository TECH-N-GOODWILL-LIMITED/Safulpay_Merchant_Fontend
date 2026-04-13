import axiosInstance from './axiosInstance'
import {
  mockDisbursementGroups,
  mockExportBlob,
  mockGroupMembers,
  mockRequestDetails,
  mockRequestLog,
} from '../mock/bulkPayments.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function getGroups(params?: Record<string, string | number | undefined>) {
  if (USE_MOCK) {
    await mockDelay(450)
    void params
    return mockDisbursementGroups
  }
  const { data } = await axiosInstance.get('/merchant/services/disbursement-groups', { params })
  return data
}

export async function createGroup(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    return {
      status: true,
      data: {
        id: 200,
        name: String(body.name ?? 'New Group'),
        description: String(body.description ?? ''),
        members_count: 0,
        requests_count: 0,
        successful: {
          amount: 0,
          base_amount: 0,
          charges: 0,
          transactions: 0,
          currency: 'SLE',
        },
        failed: { amount: 0, transactions: 0, currency: 'SLE' },
        created_at: new Date().toISOString(),
      },
    }
  }
  const { data } = await axiosInstance.post('/merchant/services/disbursement-groups', body)
  return data
}

export async function updateGroup(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(450)
    return { status: true, data: { id, ...body } }
  }
  const { data } = await axiosInstance.put(`/merchant/services/disbursement-groups/${id}`, body)
  return data
}

export async function deleteGroup(id: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(350)
    void id
    return
  }
  await axiosInstance.delete(`/merchant/services/disbursement-groups/${id}`)
}

export async function exportGroups(): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(500)
    return mockExportBlob
  }
  const { data } = await axiosInstance.get<Blob>(
    '/merchant/services/disbursement-groups/export',
    { responseType: 'blob' }
  )
  return data
}

export async function getMembers(id: number) {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    return mockGroupMembers
  }
  const { data } = await axiosInstance.get(`/merchant/services/disbursement-groups/${id}/members`)
  return data
}

export async function addMember(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void id
    return { status: true, data: { id: 9999, ...body } }
  }
  const { data } = await axiosInstance.post(
    `/merchant/services/disbursement-groups/${id}/members`,
    body
  )
  return data
}

export async function updateMember(id: number, memberId: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(450)
    void id
    return { status: true, data: { id: memberId, ...body } }
  }
  const { data } = await axiosInstance.put(
    `/merchant/services/disbursement-groups/${id}/members/${memberId}`,
    body
  )
  return data
}

export async function removeMember(id: number, memberId: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(350)
    void id
    void memberId
    return
  }
  await axiosInstance.delete(
    `/merchant/services/disbursement-groups/${id}/members/${memberId}`
  )
}

export async function getRequestLog(id: number) {
  if (USE_MOCK) {
    await mockDelay(400)
    void id
    return mockRequestLog
  }
  const { data } = await axiosInstance.get(
    `/merchant/services/disbursement-groups/${id}/request-log`
  )
  return data
}

export async function createBulkRequest(id: number, body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(900)
    void id
    return { status: true, data: { tag: 'BR-MOCK-' + Date.now(), ...body } }
  }
  const { data } = await axiosInstance.post(
    `/merchant/services/disbursement-groups/${id}/request`,
    body
  )
  return data
}

export async function getRequestDetails(tag: string) {
  if (USE_MOCK) {
    await mockDelay(500)
    void tag
    return mockRequestDetails
  }
  const { data } = await axiosInstance.get(
    `/merchant/services/disbursement-request/details/${tag}`
  )
  return data
}

export async function retryFailed(tag: string) {
  if (USE_MOCK) {
    await mockDelay(600)
    void tag
    return { status: true, data: { ok: true } }
  }
  const { data } = await axiosInstance.post(
    `/merchant/services/disbursement-request/${tag}/retry`
  )
  return data
}

export async function exportRequest(tag: string): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(500)
    void tag
    return mockExportBlob
  }
  const { data } = await axiosInstance.get<Blob>(
    `/merchant/services/disbursement-request/${tag}/export`,
    { responseType: 'blob' }
  )
  return data
}
