import type { Pagination } from '../types'

export const mockSinglePaymentHistory = {
  status: true,
  data: {
    items: [
      {
        tag: 'SP-1763291086-5695',
        recipient_name: 'Toluwani Adepoju',
        recipient_phone: '23278672866',
        service: 'Orange money transfer',
        amount: 3,
        currency: 'SLE',
        status: 'Completed',
        date: '2025-11-16T11:04:00Z',
        transaction_id: '20251116110506RB2YLC',
        account: '23278672866',
        payout_response:
          'Cash in done. You will receive details by SMS. Thank you for using Orange Money.',
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 20,
      total: 1,
      total_pages: 1,
    } satisfies Pagination,
  },
}

export const mockSinglePaymentDetail = {
  status: true,
  data: mockSinglePaymentHistory.data.items[0],
}
