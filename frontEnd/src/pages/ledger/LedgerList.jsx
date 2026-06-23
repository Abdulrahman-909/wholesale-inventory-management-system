import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ledgerService } from '../../services/ledgerService.js'
import { getErrorMessage } from '../../services/api.js'

export function LedgerList() {
  const [summary, setSummary] = useState(null)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([ledgerService.summary(), ledgerService.list()])
      .then(([s, l]) => {
        setSummary(s)
        setRows(Array.isArray(l) ? l : [])
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Ledger Overview</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {summary ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">Customers owe: {summary.total_customers_owe_you}</div>
          <div className="rounded-lg border p-3">You owe suppliers: {summary.total_you_owe_suppliers}</div>
          <div className="rounded-lg border p-3">Overdue count: {summary.overdue_count}</div>
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Supplier</th>
              <th className="px-3 py-2 text-left">Remaining</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ledger) => (
              <tr key={ledger.ledger_id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2">{ledger.ledger_type_name}</td>
                <td className="px-3 py-2">
                  {ledger.customer_name ? (
                    <Link className="text-emerald-700 hover:underline dark:text-emerald-400" to={`/ledger/customer/${ledger.customer}`}>
                      {ledger.customer_name}
                    </Link>
                  ) : '-'}
                </td>
                <td className="px-3 py-2">
                  {ledger.supplier_name ? (
                    <Link className="text-emerald-700 hover:underline dark:text-emerald-400" to={`/ledger/supplier/${ledger.supplier}`}>
                      {ledger.supplier_name}
                    </Link>
                  ) : '-'}
                </td>
                <td className="px-3 py-2">{ledger.remaining}</td>
                <td className="px-3 py-2">{ledger.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
