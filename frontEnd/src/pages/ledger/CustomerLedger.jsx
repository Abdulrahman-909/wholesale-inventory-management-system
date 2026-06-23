import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ledgerService } from '../../services/ledgerService.js'
import { getErrorMessage } from '../../services/api.js'

export function CustomerLedger() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [loadingPay, setLoadingPay] = useState(false)

  async function loadLedger() {
    try {
      const result = await ledgerService.customer(id)
      setData(result)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => {
  async function debugLoad() {
    try {
      const res = await ledgerService.customer(id)
      console.log(res) // 👈 THIS is what we need
      setData(res)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  debugLoad()
}, [id])

  async function handlePayment() {
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid payment amount')
      return
    }

    try {
      setLoadingPay(true)

      await ledgerService.payment({
  ledger_id: data.transactions[0].ledger_id,
  amount: Number(amount),
  payment_method: 'cash',
})

      alert('Payment successful')
      setAmount('')
      await loadLedger()
    } catch (err) {
      alert(getErrorMessage(err))
    } finally {
      setLoadingPay(false)
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Customer Ledger
      </h1>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {data ? (
        <>
          <p>Credit remaining: {data.total_credit_remaining}</p>
          <p>Debit remaining: {data.total_debit_remaining}</p>

          <div className="rounded-lg border p-3">
            Transactions: {data.transactions?.length || 0}
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <h2 className="font-semibold">Add Customer Payment</h2>

            <input
              type="number"
              placeholder="Enter payment amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded border p-2"
            />

            <button
              onClick={handlePayment}
              disabled={loadingPay}
              className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loadingPay ? 'Processing...' : 'Make Payment'}
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  )
}