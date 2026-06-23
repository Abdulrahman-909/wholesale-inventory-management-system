import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const linkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-3 sm:py-2'

function navLinkClass({ isActive }) {
  return `${linkBase} ${
    isActive
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`
}

/**
 * Responsive navbar with mobile menu.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          onClick={() => setOpen(false)}
        >
          WholeSale
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/products/new" className={navLinkClass}>
            Add product
          </NavLink>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden ${
          open ? 'block' : 'hidden'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={() => setOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/products/new" className={navLinkClass} onClick={() => setOpen(false)}>
            Add product
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
