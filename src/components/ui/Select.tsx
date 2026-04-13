import type { SelectHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  name: string
  options: SelectOption[]
  error?: string
  register?: UseFormRegisterReturn
  required?: boolean
  placeholder?: string
}

export function Select({
  label,
  name,
  options,
  error,
  register,
  required,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? name
  const errorRing = error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-brand focus:border-brand'

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="mb-1 block text-sm text-gray-600">
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <select
        id={selectId}
        name={name}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 ${errorRing} ${className}`}
        {...(register ? register : {})}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
