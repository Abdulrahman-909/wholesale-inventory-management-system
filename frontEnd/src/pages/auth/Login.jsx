import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useI18n } from '../../context/LanguageContext.jsx'
import { getErrorMessage } from '../../services/api.js'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useI18n()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t('signIn')}</h1>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        placeholder={t('username')}
        value={form.username}
        onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
      />
      <input
        type="password"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        placeholder={t('password')}
        value={form.password}
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white">{t('login')}</button>
      <p className="text-sm text-slate-600 dark:text-slate-400">Contact admin for account credentials.</p>
    </form>
  )
}
