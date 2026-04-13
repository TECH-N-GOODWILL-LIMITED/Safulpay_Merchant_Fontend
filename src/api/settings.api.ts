import axiosInstance from './axiosInstance'
import {
  mock2FAResponse,
  mockApiKeysResponse,
  mockProfileResponse,
  mockQRCode,
} from '../mock/settings.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function getProfile() {
  if (USE_MOCK) {
    await mockDelay(400)
    return mockProfileResponse
  }
  const { data } = await axiosInstance.get<typeof mockProfileResponse>('/merchant/profile')
  return data
}

export async function updateProfile(formData: FormData) {
  if (USE_MOCK) {
    await mockDelay(700)
    void formData
    return mockProfileResponse
  }
  const { data } = await axiosInstance.post<typeof mockProfileResponse>('/merchant/profile', formData)
  return data
}

export async function changePin(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void body
    return { status: true, data: { ok: true } }
  }
  const { data } = await axiosInstance.post('/merchant/change-pin', body)
  return data
}

export async function get2FA() {
  if (USE_MOCK) {
    await mockDelay(350)
    return mock2FAResponse
  }
  const { data } = await axiosInstance.get<typeof mock2FAResponse>('/merchant/2fa')
  return data
}

export async function enable2FA(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void body
    return { status: true, data: { enabled: true } }
  }
  const { data } = await axiosInstance.post('/merchant/2fa/enable', body)
  return data
}

export async function disable2FA(body: Record<string, unknown>) {
  if (USE_MOCK) {
    await mockDelay(500)
    void body
    return { status: true, data: { enabled: false } }
  }
  const { data } = await axiosInstance.post('/merchant/2fa/disable', body)
  return data
}

export async function getQRCode() {
  if (USE_MOCK) {
    await mockDelay(400)
    return mockQRCode
  }
  const { data } = await axiosInstance.get<typeof mockQRCode>('/merchant/qr-code')
  return data
}

export async function downloadQRCode(): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(400)
    return new Blob(['mock-qr'], { type: 'image/png' })
  }
  const { data } = await axiosInstance.get<Blob>('/merchant/qr-code/download', {
    responseType: 'blob',
  })
  return data
}

export async function getApiKeys() {
  if (USE_MOCK) {
    await mockDelay(350)
    return mockApiKeysResponse
  }
  const { data } = await axiosInstance.get<typeof mockApiKeysResponse>(
    '/merchant/business/api-key'
  )
  return data
}

export async function generateApiKey() {
  if (USE_MOCK) {
    await mockDelay(600)
    return {
      status: true,
      data: {
        bearer_token: 'sk_live_new_' + Math.random().toString(36).slice(2),
        refresh_token: 'rt_new_' + Math.random().toString(36).slice(2),
      },
    }
  }
  const { data } = await axiosInstance.post('/merchant/business/api-key/generate')
  return data
}
