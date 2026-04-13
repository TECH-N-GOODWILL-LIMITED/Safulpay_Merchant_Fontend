import type { InputHTMLAttributes, ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  register?: UseFormRegisterReturn
  icon?: ReactNode
}

export function Input({
  label,
  name,
  error,
  register,
  required,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? name
  const errorRing = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-brand focus:border-brand'

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-1 block text-sm text-gray-600">
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          name={name}
          className={`w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 ${icon ? 'pl-10' : ''} ${errorRing} ${className}`}
          {...(register ? register : {})}
          {...props}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
