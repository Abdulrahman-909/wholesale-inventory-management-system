import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supplierService } from '../../services/supplierService.js'
import { getErrorMessage } from '../../services/api.js'

export function SupplierForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    last_name: '',
    phone_number: '',
    province_id: '',
    email: '',
  })

  useEffect(() => {
    if (!isEdit) return
    async function loadDetail() {
      try {
        const data = await supplierService.detail(id)
        setForm({
          name: data.name ?? '',
          last_name: data.last_name ?? '',
          phone_number: data.phone_number ?? '',
          province_id: data.province_id ?? '',
          email: data.email ?? '',
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
        await supplierService.update(id, form)
      } else {
        await supplierService.create(form)
      }
      navigate('/suppliers')
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
          {isEdit ? 'Edit Supplier' : 'Add Supplier'}
        </h1>
        <Link to="/suppliers" className="text-sm text-emerald-700 hover:underline dark:text-emerald-400">
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
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Name</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Last Name</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.last_name}
                onChange={(e) => onChange('last_name', e.target.value)}
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Phone</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.phone_number}
                onChange={(e) => onChange('phone_number', e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-700 dark:text-slate-300">Province</span>
              <input
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                value={form.province_id}
                onChange={(e) => onChange('province_id', e.target.value)}
                required
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-700 dark:text-slate-300">Email (optional)</span>
            <input
              type="email"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Supplier' : 'Create Supplier'}
          </button>
        </form>
      )}
    </section>
  )
}
