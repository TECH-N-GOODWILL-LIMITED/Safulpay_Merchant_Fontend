import type { Transaction } from '../types'

export const mockDashboardData = {
  status: true,
  data: {
    merchant: {
      id: 1,
      business_name: "TECH'N GOODWIL LTD",
      username: 'techengood',
      profile_photo: '',
    },
    wallet: {
      balance: 48.73,
      currency: 'SLE',
    },
    insights: {
      period: 'last_7_days',
      total_money_received: 0.0,
      total_money_out: 0.0,
      currency: 'SLE',
    },
  },
}

export const mockWalletsResponse = {
  status: true,
  data: {
    wallets: [
      {
        id: 1,
        name: 'Main',
        label: 'Main wallet',
        balance: 48.73,
        currency: 'SLE',
      },
    ],
  },
}

export const mockMonthlyReport = {
  status: true,
  data: {
    report: [
      { month: 'Jan-2025', total: 0 },
      { month: 'Feb-2025', total: 0 },
      { month: 'Mar-2025', total: 500 },
      { month: 'Apr-2025', total: 200 },
      { month: 'May-2025', total: 800 },
      { month: 'Jun-2025', total: 300 },
      { month: 'Jul-2025', total: 2500 },
      { month: 'Aug-2025', total: 400 },
      { month: 'Sep-2025', total: 0 },
      { month: 'Oct-2025', total: 0 },
      { month: 'Nov-2025', total: 0 },
      { month: 'Dec-2025', total: 0 },
    ],
    currency: 'SLE',
  },
}

export const mockLatestTransactions = {
  status: true,
  data: {
    transactions: [
      {
        id: 101,
        transaction_id: '20260316091358F7N3UU',
        type: 'debit' as const,
        label: 'Toluwani Adepoju',
        counterpart_name: 'Toluwani Adepoju',
        user_type: 'Offline User',
        remark: 'Money Out',
        wallet: 'SLE',
        before_charge: 3.0,
        charge: 0.15,
        transacted_amount: 3.15,
        remaining_balance: 48.73,
        currency: 'SLE',
        status: 'successful' as const,
        date: '2026-03-16T09:13:58Z',
        service_provider_response: 'Cash in done. Thank you for using Orange Money.',
      },
      {
        id: 100,
        transaction_id: '20260316090822183H7',
        type: 'credit' as const,
        label: 'Money In',
        counterpart_name: 'Toluwani Adepoju',
        user_type: null,
        remark: 'Money In',
        wallet: 'SLE',
        before_charge: 3.0,
        charge: 0.03,
        transacted_amount: 3.0,
        remaining_balance: 51.88,
        currency: 'SLE',
        status: 'successful' as const,
        date: '2026-03-16T09:08:22Z',
        service_provider_response: null,
      },
    ] satisfies Transaction[],
  },
}

/** Insights vary slightly by period (mock) */
export const mockInsightsByPeriod: Record<
  string,
  { period: string; total_money_received: number; total_money_out: number; currency: string }
> = {
  last_7_days: {
    period: 'last_7_days',
    total_money_received: 0,
    total_money_out: 0,
    currency: 'SLE',
  },
  last_30_days: {
    period: 'last_30_days',
    total_money_received: 150.25,
    total_money_out: 45.0,
    currency: 'SLE',
  },
  this_month: {
    period: 'this_month',
    total_money_received: 320.0,
    total_money_out: 110.5,
    currency: 'SLE',
  },
  this_year: {
    period: 'this_year',
    total_money_received: 5200.0,
    total_money_out: 2100.0,
    currency: 'SLE',
  },
}
