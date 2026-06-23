import { useState } from 'react' // for the openig and closing of the menu
import { Link, NavLink } from 'react-router-dom'//going from one page to another without rfreshing we use link
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useI18n } from '../../context/LanguageContext.jsx'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()// is use to take the information from user by useauth()
  const { isDark, toggleTheme } = useTheme()
  const { t, language, setLanguage } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    ['/dashboard', t('navDashboard')],
    ['/pos', t('navPos')],
    ['/products', t('navProducts')],
    ['/customers', t('navCustomers')],
    ['/suppliers', t('navSuppliers')],
    ['/stock', t('navStock')],
    ['/ledger', t('navLedger')],
    ['/reports/daily', t('navReports')],
  ]
  if (isAdmin) {
    navItems.push(['/staff', 'Users'])
  }

  function linkClass(isActive) {
    return `rounded-md px-3 py-1.5 text-sm ${
      isActive
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          {t('appName')}
        </Link>
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => linkClass(isActive)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? t('light') : t('dark')}
          </button>
          <select
            aria-label={t('language')}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="en">English</option>
            <option value="fa">دری</option>
            <option value="ps">پښتو</option>
          </select>
          <Link
            to="/profile"
            className="hidden rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 sm:inline dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {user?.username ?? t('navProfile')}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white dark:bg-slate-100 dark:text-slate-900"
          >
            {t('logout')}
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-2 py-1.5 text-slate-700 xl:hidden dark:border-slate-700 dark:text-slate-200"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {t('menu')}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pb-3 xl:hidden">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
            {t('navProfile')}
          </NavLink>
        </nav>
      ) : null}
    </header>
  )
}
