import axiosInstance from './axiosInstance'
import { mockSinglePaymentDetail, mockSinglePaymentHistory } from '../mock/singlePayment.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function submitSinglePayment(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(800)
    return { status: true, data: { tag: 'SP-MOCK-' + Date.now(), ...body } }
  }
  const { data } = await axiosInstance.post('/merchant/services/single-payment', body)
  return data
}

export async function getSinglePaymentHistory(filters: { page?: number; per_page?: number }) {
  if (USE_MOCK) {
    await mockDelay(450)
    void filters
    return mockSinglePaymentHistory
  }
  const { data } = await axiosInstance.get<typeof mockSinglePaymentHistory>(
    '/merchant/services/single-payment/history',
    { params: filters }
  )
  return data
}

export async function getSinglePaymentDetail(tag: string) {
  if (USE_MOCK) {
    await mockDelay(350)
    void tag
    return mockSinglePaymentDetail
  }
  const { data } = await axiosInstance.get<typeof mockSinglePaymentDetail>(
    `/merchant/services/single-payment/${tag}`
  )
  return data
}
