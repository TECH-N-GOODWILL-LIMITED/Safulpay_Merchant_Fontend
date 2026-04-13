import type { UseFormRegisterReturn } from 'react-hook-form'

export interface DatePickerProps {
  label?: string
  name: string
  error?: string
  register?: UseFormRegisterReturn
  required?: boolean
}

export function DatePicker({ label, name, error, register, required }: DatePickerProps) {
  const errorRing = error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-brand focus:border-brand'
  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={name} className="mb-1 block text-sm text-gray-600">
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <input
        id={name}
        type="date"
        className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 ${errorRing}`}
        {...(register ? register : {})}
      />
      <p className="mt-0.5 text-xs text-gray-400">Format: mm/dd/yyyy (use picker)</p>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
