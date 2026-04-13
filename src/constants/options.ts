export const SERVICE_TYPE_OPTIONS = [
  { value: 'orange_money_transfer', label: 'Orange Money Transfer' },
  { value: 'afrimoney_transfer', label: 'Afrimoney Transfer' },
  { value: 'qmoney_transfer', label: 'QMoney Transfer' },
  { value: 'orange_airtime_purchase', label: 'Orange Airtime Purchase' },
  { value: 'africell_airtime_purchase', label: 'Africell Airtime Purchase' },
  { value: 'qcell_airtime_purchase', label: 'QCell Airtime Purchase' },
  { value: 'esda_topup_purchase', label: 'EDSA Topup Purchase' },
] as const

export const TRANSACTION_REMARK_OPTIONS = [
  { value: '', label: 'All Remarks' },
  { value: 'Airtime Purchase', label: 'Airtime Purchase' },
  { value: 'Balance Add', label: 'Balance Add' },
  { value: 'Balance Subtract', label: 'Balance Subtract' },
  { value: 'Bill Payment For EDSA', label: 'Bill Payment For EDSA' },
  { value: 'Bridge Payment', label: 'Bridge Payment' },
  { value: 'Bulk Disbursement', label: 'Bulk Disbursement' },
  { value: 'Esda Top-up For', label: 'Esda Top-up For' },
  { value: 'Money Out', label: 'Money Out' },
  { value: 'Money In', label: 'Money In' },
  { value: 'Orange Money Transfer', label: 'Orange Money Transfer' },
  { value: 'Payment For Services Rendered', label: 'Payment For Services Rendered' },
  { value: 'Reconciliation Deposit', label: 'Reconciliation Deposit' },
  { value: 'Withdraw', label: 'Withdraw' },
]

export const INSIGHT_PERIOD_OPTIONS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_year', label: 'This Year' },
] as const
