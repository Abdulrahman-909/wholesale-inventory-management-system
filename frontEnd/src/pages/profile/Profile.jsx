import { useAuth } from '../../context/AuthContext.jsx'
import { useI18n } from '../../context/LanguageContext.jsx'

export function Profile() {
  const { user } = useAuth()
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('profileTitle')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {t('profileSub')}
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">{t('username')}</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {user?.username ?? '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">{t('email')}</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {user?.email || 'Not set'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">{t('userId')}</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{user?.id ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">{t('role')}</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{t('staffUser')}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
