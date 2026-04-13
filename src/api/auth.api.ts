import axiosInstance from './axiosInstance'
import { mockLoginResponse } from '../mock/auth.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function login(
  phone_number: string,
  country_code: string,
  pin: string
): Promise<typeof mockLoginResponse> {
  if (USE_MOCK) {
    await mockDelay(500)
    return mockLoginResponse
  }
  const { data } = await axiosInstance.post<typeof mockLoginResponse>('/auth/login', {
    phone_number,
    country_code,
    pin,
  })
  return data
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(200)
    return
  }
  await axiosInstance.post('/auth/logout')
}
