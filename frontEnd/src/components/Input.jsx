/**
 * Labeled text input with optional error text (basic validation display).
 */
export function Input({
  id,
  label,
  type = 'text',
  error,
  className = '',
  inputClassName = '',
  ...props
}) {
  const inputId = id ?? props.name

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type={type}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 dark:border-slate-600'
        } ${inputClassName}`}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
