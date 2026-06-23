import { useEffect, useState } from 'react'
import { purchaseService } from '../../services/purchaseService.js'
import { getErrorMessage } from '../../services/api.js'

export function PurchaseList() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    purchaseService.list().then((data) => setRows(Array.isArray(data) ? data : [])).catch((err) => setError(getErrorMessage(err)))
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Purchases</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Purchase #</th>
              <th className="px-3 py-2 text-left">Supplier</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Items</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((purchase) => (
              <tr key={purchase.buy_id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2">{purchase.buy_id}</td>
                <td className="px-3 py-2">{purchase.supplier_name}</td>
                <td className="px-3 py-2">{purchase.date}</td>
                <td className="px-3 py-2">{purchase.items?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
