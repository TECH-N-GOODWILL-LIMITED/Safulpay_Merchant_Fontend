import type { DisbursementGroup, GroupMember, Pagination } from '../types'

export const mockDisbursementGroups = {
  status: true,
  data: {
    groups: [
      {
        id: 106,
        name: 'Red Demo',
        description: 'Demo disbursement group for testing.',
        members_count: 2,
        requests_count: 1,
        successful: {
          amount: 7.35,
          base_amount: 7.0,
          charges: 0.35,
          transactions: 2,
          currency: 'SLE',
        },
        failed: { amount: 0, transactions: 0, currency: 'SLE' },
        created_at: '2025-08-27T12:38:00Z',
      },
    ] satisfies DisbursementGroup[],
    pagination: {
      current_page: 1,
      per_page: 20,
      total: 1,
      total_pages: 1,
    } satisfies Pagination,
  },
}

export const mockGroupMembers = {
  status: true,
  data: {
    members: [
      {
        id: 1121,
        full_name: 'Member One',
        kyc_name: 'Member One',
        kyc_validated: true,
        account_detail: '23278123456',
        service_slug: 'orange_money_transfer',
        amount: 2,
        currency: 'SLE',
        status: 'active' as const,
        added_at: '2025-08-27T12:45:00Z',
      },
      {
        id: 1120,
        full_name: 'Member Two',
        kyc_name: 'Member Two',
        kyc_validated: true,
        account_detail: '23278672866',
        service_slug: 'orange_money_transfer',
        amount: 5,
        currency: 'SLE',
        status: 'completed' as const,
        added_at: '2025-08-27T12:46:00Z',
      },
    ] satisfies GroupMember[],
  },
}

export const mockRequestLog = {
  status: true,
  data: {
    requests: [
      {
        tag: 'BR-2025-001',
        group_name: 'Red Demo',
        created_at: '2025-08-28T10:00:00Z',
        status: 'done',
      },
    ],
  },
}

export const mockRequestDetails = {
  status: true,
  data: {
    tag: 'BR-2025-001',
    notes: 'Bulk payout for August cycle.',
    stats: {
      total: 2,
      initiated: 2,
      pending: 0,
      total_amount: 7.0,
      total_charges: 0.35,
      currency: 'SLE',
    },
    progress: {
      percent: 100,
      completed: 2,
      rejected: 0,
      processing: 0,
      queued: 0,
      failed: 0,
    },
    rows: [
      {
        member_name: 'Member Two',
        member_id: 1120,
        account: '23278672866',
        service: 'orange_money_transfer',
        amount: 5,
        charges: 0.18,
        status: 'Completed',
        transaction_id: 'TX-ABC123',
        response: 'Success',
      },
    ],
  },
}

export const mockExportBlob = new Blob(['group,name\n106,Red Demo\n'], { type: 'text/csv' })
