import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { stockService } from '../../services/stockService.js'
import { getErrorMessage } from '../../services/api.js'

export function StockList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    stockService
      .list()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Stock</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Warehouse</th>
              <th className="px-3 py-2 text-left">Quantity</th>
              <th className="px-3 py-2 text-left">Average Price</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-3 py-3">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-3">No stock data found.</td></tr>
            ) : rows.map((row) => (
              <tr key={`${row.product__product_id}-${row.warehouse__name}`} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2">{row.product__name}</td>
                <td className="px-3 py-2">{row.warehouse__name}</td>
                <td className="px-3 py-2">{row.total_quantity}</td>
                <td className="px-3 py-2">{Number(row.average_price || 0).toFixed(2)}</td>
                <td className="px-3 py-2">
                  <Link className="text-emerald-700 hover:underline dark:text-emerald-400" to={`/stock/${row.product__product_id}`}>
                    View batches
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
