import { useState } from 'react'
import { purchaseService } from '../../services/purchaseService.js'
import { getErrorMessage } from '../../services/api.js'

export function PurchaseForm() {
  const [supplier, setSupplier] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [paymentType, setPaymentType] = useState('cash')
  const [dueDate, setDueDate] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await purchaseService.create({
        supplier: Number(supplier),
        date: new Date().toISOString().slice(0, 10),
        payment_type: paymentType,
        due_date: paymentType === 'credit' ? dueDate : null,
        items: [
          {
            product: Number(product),
            quantity: Number(quantity),
            price: Number(price),
          },
        ],
      })

      setMessage('Purchase created successfully.')
      setSupplier('')
      setProduct('')
      setQuantity(1)
      setPrice(0)
      setPaymentType('cash')
      setDueDate('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        New Purchase
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
      >
        <input
          className="w-full rounded border p-2"
          placeholder="Supplier ID"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Product ID"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          min={1}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          min={0}
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select
          className="w-full rounded border p-2"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>

        {paymentType === 'credit' ? (
          <input
            className="w-full rounded border p-2"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        ) : null}

        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Create Purchase
        </button>
      </form>

      {message ? <p className="text-green-600 dark:text-green-400">{message}</p> : null}
      {error ? <p className="text-red-600 dark:text-red-400">{error}</p> : null}
    </section>
  )
}