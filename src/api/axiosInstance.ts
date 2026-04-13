import axios, { type AxiosError } from 'axios'
import config from '../config'
import { useAuthStore } from '../store/authStore'
import type { ApiErrorPayload } from '../types'

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData && config.headers) {
    const h = config.headers as { 'Content-Type'?: string; delete?: (key: string) => void }
    if (typeof h.delete === 'function') {
      h.delete('Content-Type')
    } else {
      delete h['Content-Type']
    }
  }
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  }
)

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorPayload | undefined
    if (data?.message) return data.message
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first?.[0]) return first[0]
    }
    if (err.message === 'Network Error') {
      return 'Network error, please try again'
    }
    return err.message || 'Something went wrong'
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

export { axiosInstance }
export default axiosInstance
