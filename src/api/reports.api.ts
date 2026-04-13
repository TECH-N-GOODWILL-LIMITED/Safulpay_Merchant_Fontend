import axiosInstance from './axiosInstance'
import { mockAccountStatementBlob } from '../mock/reports.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function generateAccountStatement(body: Record<string, unknown>): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(800)
    void body
    return mockAccountStatementBlob
  }
  const { data } = await axiosInstance.post<Blob>(
    '/merchant/reports/account-statement',
    body,
    { responseType: 'blob' }
  )
  return data
}
