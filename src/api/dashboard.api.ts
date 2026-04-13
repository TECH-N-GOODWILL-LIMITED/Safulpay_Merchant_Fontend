import axiosInstance from './axiosInstance'
import {
  mockDashboardData,
  mockInsightsByPeriod,
  mockLatestTransactions,
  mockMonthlyReport,
  mockWalletsResponse,
} from '../mock/dashboard.mock'
import { mockDelay } from '../mock/delay'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

export async function getDashboardSummary() {
  if (USE_MOCK) {
    await mockDelay(500)
    return mockDashboardData
  }
  const { data } = await axiosInstance.get<typeof mockDashboardData>('/merchant/dashboard')
  return data
}

export async function getWallets() {
  if (USE_MOCK) {
    await mockDelay(350)
    return mockWalletsResponse
  }
  const { data } = await axiosInstance.get<typeof mockWalletsResponse>('/merchant/wallets')
  return data
}

export async function getInsights(period: string) {
  if (USE_MOCK) {
    await mockDelay(400)
    const row = mockInsightsByPeriod[period] ?? mockInsightsByPeriod.last_7_days
    return {
      status: true as const,
      data: row,
    }
  }
  const { data } = await axiosInstance.get<{ status: boolean; data: typeof mockInsightsByPeriod[string] }>(
    '/merchant/insights',
    { params: { period } }
  )
  return data
}

export async function getLatestTransactions(limit = 10) {
  if (USE_MOCK) {
    await mockDelay(600)
    const txs = mockLatestTransactions.data.transactions.slice(0, limit)
    return {
      status: true as const,
      data: { transactions: txs },
    }
  }
  const { data } = await axiosInstance.get<{
    status: boolean
    data: { transactions: (typeof mockLatestTransactions.data.transactions)[number][] }
  }>('/merchant/transactions/latest', { params: { limit } })
  return data
}

export async function getMonthlyReport(year?: number) {
  if (USE_MOCK) {
    await mockDelay(400)
    void year
    return mockMonthlyReport
  }
  const { data } = await axiosInstance.get<typeof mockMonthlyReport>(
    '/merchant/transactions/monthly-report',
    { params: { year } }
  )
  return data
}
