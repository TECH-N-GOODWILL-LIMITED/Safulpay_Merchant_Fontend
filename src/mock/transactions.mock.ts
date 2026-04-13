import type { Pagination, Transaction } from '../types'

const makeTx = (partial: Partial<Transaction> & Pick<Transaction, 'id' | 'transaction_id'>): Transaction => ({
  type: 'debit',
  label: 'Sample',
  counterpart_name: 'Counterpart',
  user_type: null,
  remark: 'Withdraw',
  wallet: 'SLE',
  before_charge: 0,
  charge: 0,
  transacted_amount: 10,
  remaining_balance: 100,
  currency: 'SLE',
  status: 'successful',
  date: new Date().toISOString(),
  service_provider_response: null,
  ...partial,
})

const txList: Transaction[] = Array.from({ length: 20 }, (_, i) =>
  makeTx({
    id: 1000 + i,
    transaction_id: `20260316TX${String(i).padStart(4, '0')}`,
    label: i % 2 ? 'Money Out' : 'Money In',
    type: i % 2 ? 'debit' : 'credit',
    transacted_amount: 5 + i,
    remark: i % 3 === 0 ? 'Withdraw' : 'Money In',
  })
)

export const mockTransactionHistory = {
  status: true,
  data: {
    transactions: txList,
    pagination: {
      current_page: 1,
      per_page: 20,
      total: 373,
      total_pages: 19,
    } satisfies Pagination,
  },
}

export const mockTransactionExportBlob = new Blob(['id,amount,currency\n1,10,SLE\n'], {
  type: 'text/csv',
})
