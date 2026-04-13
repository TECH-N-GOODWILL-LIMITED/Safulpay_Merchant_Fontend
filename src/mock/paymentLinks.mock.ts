import type { PaymentLink } from '../types'

export const mockPaymentLinks = {
  status: true,
  data: {
    links: [
      {
        id: 1,
        code: '42bd816760',
        link_url: 'https://pay.safulpay.com/c/42bd816760',
        amount: 5,
        amount_display: 'LE 5.00 / SLE',
        currency: 'SLE',
        note: 'Invoice #1042',
        type: 'continuous' as const,
        created_at: '2025-10-08T09:39:00Z',
      },
      {
        id: 2,
        code: '91af102233',
        link_url: 'https://pay.safulpay.com/c/91af102233',
        amount: null,
        amount_display: 'Any amount',
        currency: null,
        note: 'Open donation',
        type: 'one_time' as const,
        created_at: '2025-09-01T14:20:00Z',
      },
    ] satisfies PaymentLink[],
  },
}

export const mockCreatePaymentLinkResponse = {
  status: true,
  data: {
    link: mockPaymentLinks.data.links[0],
  },
}
