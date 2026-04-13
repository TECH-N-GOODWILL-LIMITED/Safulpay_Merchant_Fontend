import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Transaction } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ExpandableTransactionRow({ tx }: { tx: Transaction }) {
  const [open, setOpen] = useState(false)
  const isDebit = tx.type === 'debit'
  const circle = isDebit ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
  const Icon = isDebit ? ArrowUpRight : ArrowDownLeft

  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white shadow-sm ${open ? 'bg-brand-light/40 ring-1 ring-brand/20' : ''}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50/80"
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${circle}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{tx.label}</p>
          <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
        </div>
        <p className="hidden flex-1 text-sm text-gray-500 sm:block">{tx.counterpart_name}</p>
        <p
          className={`shrink-0 text-sm font-bold ${open ? 'text-purple-600' : 'text-gray-900'}`}
        >
          {formatCurrency(tx.transacted_amount, tx.currency)}
        </p>
      </button>
      {open ? (
        <div className="border-t border-dashed border-gray-200 px-4 py-3 text-sm">
          <DetailRow label="Transaction ID" value={tx.transaction_id} mono />
          <DetailRow label="Wallet" value={tx.wallet} />
          <DetailRow label="Before Charge" value={String(tx.before_charge)} />
          <DetailRow label="Charge" value={String(tx.charge)} />
          <DetailRow label="Transacted Amount" value={String(tx.transacted_amount)} />
          <DetailRow label="Remaining Balance" value={String(tx.remaining_balance)} />
          {tx.service_provider_response ? (
            <DetailRow label="Service Provider Response" value={tx.service_provider_response} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-dashed border-gray-100 py-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-sm text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
