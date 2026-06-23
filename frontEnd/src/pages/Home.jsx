import { Link } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'

export function Home() {
  const { isAuthenticated } = useAuth()
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 dark:bg-black bg-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{t('homeTag')}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          {t('homeTitle')}
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg dark:text-slate-300">
          {t('homeSubtitle')}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="sm:inline-flex">
            <Button className="w-full sm:w-auto">
              {isAuthenticated ? t('goDashboard') : t('signIn')}
            </Button>
          </Link>
          {/* <Link to={isAuthenticated ? '/products/new' : '/register'} className="sm:inline-flex">
            <Button variant="outline" className="w-full sm:w-auto">
              {isAuthenticated ? t('addProduct') : t('createAccountBtn')}
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  )
}