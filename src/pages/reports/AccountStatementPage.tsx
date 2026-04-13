import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { generateAccountStatement } from '../../api/reports.api'
import { getApiErrorMessage } from '../../api/axiosInstance'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'

export function AccountStatementPage() {
  const [wallet, setWallet] = useState('sle_techengood')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      generateAccountStatement({
        wallet,
        from_date: from,
        to_date: to,
      }),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'account-statement.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Statement generated')
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Account Statement</h1>
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          ℹ Generate and download your account statement for a selected date range. The statement
          includes all inflows, outflows, and bulk disbursements.
        </div>
        <div className="mt-6 space-y-4">
          <Select
            label="Wallet / Currency"
            name="wallet"
            options={[{ value: 'sle_techengood', label: 'SLE — Techengood' }]}
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Account statement is generated for the selected merchant wallet only (single currency).
          </p>
          <div>
            <label className="mb-1 block text-sm text-gray-600">From Date *</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="mt-0.5 text-xs text-gray-400">mm/dd/yyyy</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">To Date *</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="mt-0.5 text-xs text-gray-400">mm/dd/yyyy</p>
          </div>
          <Button
            className="w-full"
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Generate & Download Statement
          </Button>
        </div>
      </div>
    </div>
  )
}
