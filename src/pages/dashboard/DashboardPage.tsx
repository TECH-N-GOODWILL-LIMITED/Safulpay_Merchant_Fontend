import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Wallet } from 'lucide-react'
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
} from 'recharts'
import {
  getDashboardSummary,
  getInsights,
  getLatestTransactions,
  getMonthlyReport,
  getWallets,
} from '../../api/dashboard.api'
import { formatCurrency } from '../../utils/formatters'
import { ExpandableTransactionRow } from '../../components/transactions/ExpandableTransactionRow'
import { Spinner } from '../../components/ui/Spinner'
import { INSIGHT_PERIOD_OPTIONS } from '../../constants/options'

export function DashboardPage() {
  const year = new Date().getFullYear()
  const [period, setPeriod] = useState<string>('last_7_days')

  const walletsQuery = useQuery({ queryKey: ['wallets'], queryFn: getWallets })
  const monthlyQuery = useQuery({
    queryKey: ['monthly-report', year],
    queryFn: () => getMonthlyReport(year),
  })
  const insightsQuery = useQuery({
    queryKey: ['insights', period],
    queryFn: () => getInsights(period),
  })
  const latestQuery = useQuery({
    queryKey: ['latest-tx', 10],
    queryFn: () => getLatestTransactions(10),
  })
  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
  })

  const reportRows = monthlyQuery.data?.data.report ?? []
  const chartData = reportRows.map((row) => ({
    name: row.month.split('-')[0] ?? row.month,
    amount: row.total,
  }))

  const wallets = walletsQuery.data?.data.wallets ?? []
  const primaryWallet = wallets[0]
  const dash = summaryQuery.data?.data
  const balance = primaryWallet?.balance ?? dash?.wallet?.balance ?? 0
  const currency = primaryWallet?.currency ?? dash?.wallet?.currency ?? 'SLE'

  const ins = insightsQuery.data?.data
  const received = ins?.total_money_received ?? dash?.insights?.total_money_received ?? 0
  const spent = ins?.total_money_out ?? dash?.insights?.total_money_out ?? 0
  const insCurrency = ins?.currency ?? dash?.insights?.currency ?? 'SLE'

  const periodLabel =
    INSIGHT_PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? 'Last 7 Days'

  const transactions = latestQuery.data?.data.transactions ?? []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Wallets</h2>
          <Link to="/transactions" className="text-sm font-medium text-brand hover:underline">
            More Wallets →
          </Link>
        </div>
        {walletsQuery.isLoading ? (
          <Spinner />
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4 border-l-4 border-brand pl-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {primaryWallet?.label ?? primaryWallet?.name ?? 'Main wallet'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(balance, currency)}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Transaction Report</h2>
          <div className="mt-4 h-72">
            {monthlyQuery.isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => [`LE${Number(v).toFixed(2)}`, 'Amount']}
                    labelFormatter={(l) => `Month: ${String(l)}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    fill="#3B82F6"
                    fillOpacity={0.12}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Insights</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            >
              {INSIGHT_PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {insightsQuery.isLoading ? (
            <Spinner />
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Total Money Received ({periodLabel.toLowerCase()})
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(received, insCurrency)}
                </p>
                <Link to="/transactions" className="mt-2 inline-block text-xs text-brand hover:underline">
                  Total received
                </Link>
                <div className="mt-3">
                  <Link
                    to="/transactions"
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    View Transactions
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Total Money out ({periodLabel.toLowerCase()})
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(spent, insCurrency)}
                </p>
                <Link to="/transactions" className="mt-2 inline-block text-xs text-brand hover:underline">
                  Total spent
                </Link>
                <div className="mt-3">
                  <Link
                    to="/transactions"
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    View Transactions
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-800">Latest Transactions</h2>
        <div className="mt-4 space-y-3">
          {latestQuery.isLoading ? (
            <Spinner />
          ) : transactions.length ? (
            transactions.map((tx) => <ExpandableTransactionRow key={tx.id} tx={tx} />)
          ) : (
            <p className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-500">
              No recent transactions
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
