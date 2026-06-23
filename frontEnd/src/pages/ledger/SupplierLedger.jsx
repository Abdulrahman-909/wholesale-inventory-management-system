import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ledgerService } from '../../services/ledgerService.js'
import { getErrorMessage } from '../../services/api.js'

export function SupplierLedger() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ledgerService.supplier(id).then(setData).catch((err) => setError(getErrorMessage(err)))
  }, [id])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Supplier Ledger</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {data ? (
        <>
          <p>Credit remaining: {data.total_credit_remaining}</p>
          <p>Debit remaining: {data.total_debit_remaining}</p>
          <div className="rounded-lg border p-3">
            Transactions: {data.transactions?.length || 0}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  )
}
