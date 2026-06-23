import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { stockService } from '../../services/stockService.js'
import { getErrorMessage } from '../../services/api.js'

export function StockDetail() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    stockService
      .productStock(id)
      .then(setDetail)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Stock Detail</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {loading ? <p>Loading...</p> : null}
      {!loading && detail ? (
        <>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Product #{detail.product_id} total quantity: {detail.total_quantity}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">Warehouse</th>
                  <th className="px-3 py-2 text-left">Quantity</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Expire Date</th>
                </tr>
              </thead>
              <tbody>
                {detail.batches?.map((batch) => (
                  <tr key={batch.stock_id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2">{batch.warehouse_name}</td>
                    <td className="px-3 py-2">{batch.quantity}</td>
                    <td className="px-3 py-2">{batch.price}</td>
                    <td className="px-3 py-2">{batch.expire_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  )
}
