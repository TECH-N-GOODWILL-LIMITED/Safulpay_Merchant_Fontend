export interface User {
  id: number
  name: string
  phone_number: string
  email: string
  profile_photo: string
  is_verified: boolean
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export interface Transaction {
  id: number
  transaction_id: string
  type: 'credit' | 'debit'
  label: string
  counterpart_name: string
  user_type: string | null
  remark: string
  wallet: string
  before_charge: number
  charge: number
  transacted_amount: number
  remaining_balance: number
  currency: string
  status: 'successful' | 'pending' | 'cancelled'
  date: string
  service_provider_response: string | null
}

export interface Pagination {
  current_page: number
  per_page: number
  total: number
  total_pages: number
}

export interface Event {
  id: number
  title: string
  description: string
  organizer: { name: string; role: string }
  venue: string
  image_url: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  tickets: { categories: number; sold: number; max_tickets: number | null }
  status: 'active' | 'inactive'
  public_url: string
}

export interface PaymentLink {
  id: number
  code: string
  link_url: string
  amount: number | null
  amount_display: string
  currency: string | null
  note: string
  type: 'one_time' | 'continuous'
  created_at: string
}

export interface DisbursementGroup {
  id: number
  name: string
  description: string
  members_count: number
  requests_count: number
  successful: {
    amount: number
    base_amount: number
    charges: number
    transactions: number
    currency: string
  }
  failed: { amount: number; transactions: number; currency: string }
  created_at: string
}

export interface GroupMember {
  id: number
  full_name: string
  kyc_name: string
  kyc_validated: boolean
  account_detail: string
  service_slug: string
  amount: number
  currency: string
  status: 'pending' | 'active' | 'requested' | 'completed' | 'failed'
  added_at: string
}

export interface WalletAccount {
  id?: number
  name?: string
  currency: string
  balance: number
  label?: string
}

export interface MonthlyReportEntry {
  month: number
  month_name?: string
  amount: number
}

export interface InsightsPeriodData {
  received: number
  spent: number
  currency: string
}

export interface DashboardSummary {
  [key: string]: unknown
}

export interface TransactionHistoryFilters {
  page?: number
  per_page?: number
  type?: 'credit' | 'debit'
  currency?: string
  status?: string
  remark?: string
  from_date?: string
  to_date?: string
}

export interface TransactionHistoryResponse {
  data: Transaction[]
  pagination: Pagination
}

export interface EventCategory {
  id: number
  name: string
  price: number
  currency: string
  description?: string
  max_tickets: number | null
  sold?: number
  status?: string
}

export interface EventOrganizerRow {
  id: number
  name: string
  email: string
  phone: string
  role: string
  assigned_at: string
  is_creator?: boolean
}

export interface EventTicketRow {
  id: number
  ticket_number: string
  category: string
  buyer_name: string
  buyer_email?: string
  buyer_phone: string
  price: number
  currency: string
  status: string
  image_url?: string | null
  purchased_at: string
}

export interface EventAnalyticsData {
  event?: Event
  tickets_sold?: number
  tickets_total_percent?: string
  total_revenue?: number
  avg_per_ticket?: number
  scanned?: number
  attendance_rate?: string
  unique_buyers?: number
  tickets_per_buyer?: string
  status_breakdown?: Record<string, number>
  sales_over_time?: { date: string; count: number }[]
  revenue_by_category?: { name: string; value: number }[]
  category_performance?: {
    category: string
    price: number
    sold: number
    available: string | number
    revenue: number
    progress: string
  }[]
  performance?: { avg_price: number; best_category: string }
  peak?: { hour: string; day: string; velocity: string; attendance: string }
  timeline?: {
    days_since_start: number
    start: string
    end: string
    projected_revenue: number
  }
  revenue_by_currency?: { currency: string; tickets: number; amount: number }[]
  recent_sales?: {
    ticket: string
    buyer: string
    amount: number
    time: string
  }[]
}

export interface SinglePaymentHistoryRow {
  tag: string
  recipient_name: string
  recipient_phone?: string
  service: string
  amount: number
  currency: string
  status: string
  date: string
  transaction_id?: string
  account?: string
  payout_response?: string
}

export interface BulkRequestLogRow {
  tag: string
  group_name: string
  created_at: string
  status?: string
}

export interface BulkRequestDetails {
  tag: string
  notes?: string
  stats?: {
    total: number
    initiated: number
    pending: number
    total_amount: number
    total_charges: number
    currency: string
  }
  progress?: {
    percent: number
    completed: number
    rejected: number
    processing: number
    queued: number
    failed: number
  }
  rows?: BulkRequestTransactionRow[]
}

export interface BulkRequestTransactionRow {
  member_name: string
  member_id?: number
  account: string
  service: string
  amount: number
  charges: number
  status: string
  transaction_id: string
  response?: string
}

export interface ProfileData {
  business_name?: string
  username?: string
  email?: string
  mobile?: string
  country?: string
  first_name?: string
  last_name?: string
  address?: string
  state?: string
  zip?: string
  city?: string
  profile_image_url?: string
}

export interface ApiKeyData {
  bearer_token: string
  refresh_token: string
}

export interface TwoFactorStatus {
  enabled: boolean
  secret?: string
  qr_url?: string
}

export interface QrCodeResponse {
  qr_code_url: string
}

export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
}
