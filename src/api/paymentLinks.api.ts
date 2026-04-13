import axiosInstance from './axiosInstance'
import { mockCreatePaymentLinkResponse, mockPaymentLinks } from '../mock/paymentLinks.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function getPaymentLinks() {
  if (USE_MOCK) {
    await mockDelay(400)
    return mockPaymentLinks
  }
  const { data } = await axiosInstance.get<typeof mockPaymentLinks>('/merchant/collections')
  return data
}

export async function createPaymentLink(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(550)
    void body
    return mockCreatePaymentLinkResponse
  }
  const { data } = await axiosInstance.post<typeof mockCreatePaymentLinkResponse>(
    '/merchant/collections/create',
    body
  )
  return data
}

export async function deletePaymentLink(code: string): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(350)
    void code
    return
  }
  await axiosInstance.delete(`/merchant/collections/${code}`)
}
