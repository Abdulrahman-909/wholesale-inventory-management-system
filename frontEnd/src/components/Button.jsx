const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-sm',
  secondary:
    'bg-slate-600 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline:
    'border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800/80',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
}

/**
 * Reusable button with Tailwind variants.
 */
export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
