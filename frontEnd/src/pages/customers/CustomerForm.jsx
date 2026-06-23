import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { customerService } from '../../services/customerService.js'
import { getErrorMessage } from '../../services/api.js'

export function CustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    province_id: '',
    district_id: '',
  })

  useEffect(() => {
    if (!isEdit) return
    async function loadDetail() {
      try {
        const data = await customerService.detail(id)
        setForm({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          phone: data.phone ?? '',
          province_id: data.province_id ?? '',
          district_id: data.district_id ?? '',
        })
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [id, isEdit])

  function onChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isEdit) {
        await customerService.update(id, form)
      } else {
        await customerService.create(form)
      }
      navigate('/customers')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? 'Edit Customer' : 'Add Customer'}
        </h1>
        <Link to="/customers" className="text-sm text-emerald-700 hover:underline dark:text-emerald-400">
          Back to list
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">First Name</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.first_name}
                onChange={(e) => onChange('first_name', e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Last Name</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.last_name}
                onChange={(e) => onChange('last_name', e.target.value)}
                required
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-700 dark:text-slate-300">Phone</span>
            <input
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Province</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.province_id}
                onChange={(e) => onChange('province_id', e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">District</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.district_id}
                onChange={(e) => onChange('district_id', e.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
        </form>
      )}
    </section>
  )
}
