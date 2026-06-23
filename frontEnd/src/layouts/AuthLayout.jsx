import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export function AuthLayout() {
  const { isAuthenticated, loading } = useAuth()
  const { t, language, setLanguage } = useI18n()
  const { isDark, toggleTheme } = useTheme()
  if (loading) return <div className="p-8 text-center text-slate-700 dark:text-slate-200">{t('loading')}</div>
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
        </div>
        <Outlet />
      </div>
    </div>
  )
}
