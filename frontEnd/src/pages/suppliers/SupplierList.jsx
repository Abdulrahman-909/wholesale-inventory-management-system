import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supplierService } from '../../services/supplierService.js'
import { getErrorMessage } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export function SupplierList() {
  const { isAdmin } = useAuth()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadSuppliers() {
    setLoading(true)
    setError('')
    try {
      const data = await supplierService.list()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getErrorMessage(err))
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function handleDelete(supplierId) {
    const confirmed = window.confirm('Delete this supplier?')
    if (!confirmed) return
    try {
      await supplierService.remove(supplierId)
      setSuppliers((prev) => prev.filter((s) => (s.supplier_id ?? s.id) !== supplierId))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Suppliers</h1>
        {isAdmin ? (
          <Link
            to="/suppliers/new"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Add Supplier
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Name</th>
              <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Phone</th>
              <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Province</th>
              <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Email</th>
              <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-slate-500 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-slate-500 dark:text-slate-400">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => {
                const id = supplier.supplier_id ?? supplier.id
                return (
                  <tr key={id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                      {supplier.name} {supplier.last_name ?? ''}
                    </td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{supplier.phone_number}</td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{supplier.province_id}</td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{supplier.email || '-'}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        {isAdmin ? (
                          <>
                            <Link to={`/suppliers/${id}/edit`} className="text-emerald-700 hover:underline dark:text-emerald-400">
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(id)}
                              className="text-red-700 hover:underline dark:text-red-400"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">Read only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
