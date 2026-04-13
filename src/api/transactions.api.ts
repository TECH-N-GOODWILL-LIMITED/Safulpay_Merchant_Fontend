import axiosInstance from './axiosInstance'
import { mockTransactionExportBlob, mockTransactionHistory } from '../mock/transactions.mock'
import { mockDelay } from '../mock/delay'
import type { Transaction, TransactionHistoryFilters } from '../types'

// ─── TOGGLE: set to false when backend is ready ───
const USE_MOCK = true
// ─────────────────────────────────────────────────

type HistoryEnvelope = typeof mockTransactionHistory

export async function getTransactionHistory(
  filters: TransactionHistoryFilters
): Promise<HistoryEnvelope> {
  if (USE_MOCK) {
    await mockDelay(450)
    void filters
    return mockTransactionHistory
  }
  const { data } = await axiosInstance.get<HistoryEnvelope>('/merchant/transactions/history', {
    params: filters,
  })
  return data
}

export async function getTransactionDetail(id: number): Promise<{ status: boolean; data: Transaction }> {
  if (USE_MOCK) {
    await mockDelay(300)
    const tx =
      mockTransactionHistory.data.transactions.find((t) => t.id === id) ??
      mockTransactionHistory.data.transactions[0]
    return { status: true, data: tx }
  }
  const { data } = await axiosInstance.get<{ status: boolean; data: Transaction }>(
    `/merchant/transactions/${id}`
  )
  return data
}

export async function exportTransactions(
  filters: Omit<TransactionHistoryFilters, 'page' | 'per_page'>
): Promise<Blob> {
  if (USE_MOCK) {
    await mockDelay(500)
    void filters
    return mockTransactionExportBlob
  }
  const { data } = await axiosInstance.get<Blob>('/merchant/transactions/export', {
    params: filters,
    responseType: 'blob',
  })
  return data
}
