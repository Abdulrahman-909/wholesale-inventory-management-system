import { useMemo, useState } from 'react'
import { getErrorMessage } from '../../services/api.js'
import { customerService } from '../../services/customerService.js'
import { salesService } from '../../services/salesService.js'
import { useProducts } from '../../hooks/useProducts.js'
import { useEffect } from 'react'
import { useI18n } from '../../context/LanguageContext.jsx'

function toProductId(product) {
  return product.product_id ?? product.id ?? product.pk
}

function customerName(customer) {
  if (!customer) return ''
  const fullName = `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
  return fullName || `Customer #${customer.customer_id ?? customer.id}`
}

export function PointOfSale() {
  const { t } = useI18n()
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const [customers, setCustomers] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [paymentType, setPaymentType] = useState('cash')
  const [dueDate, setDueDate] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')
  const [items, setItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [lastInvoice, setLastInvoice] = useState(null)

  useEffect(() => {
    customerService
      .list()
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]))
  }, [])

  const selectedCustomer = useMemo(
    () => customers.find((c) => String(c.customer_id ?? c.id) === String(customerId)),
    [customers, customerId],
  )

  const selectedProductObj = useMemo(
    () => products.find((p) => String(toProductId(p)) === String(selectedProduct)),
    [products, selectedProduct],
  )

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0),
    [items],
  )

  function resetLineForm() {
    setSelectedProduct('')
    setQuantity('1')
    setUnitPrice('')
  }

  function addLineItem() {
    setSubmitError('')
    if (!selectedProductObj) {
      setSubmitError('Select a product before adding item.')
      return
    }

    const q = Number(quantity)
    const p = Number(unitPrice)
    if (!Number.isInteger(q) || q <= 0) {
      setSubmitError('Quantity must be a positive whole number.')
      return
    }
    if (Number.isNaN(p) || p < 0) {
      setSubmitError('Unit price must be 0 or higher.')
      return
    }

    setItems((prev) => [
      ...prev,
      {
        product: toProductId(selectedProductObj),
        product_name: selectedProductObj.name ?? 'Product',
        quantity: q,
        price: p,
      },
    ])
    resetLineForm()
  }

  function removeLine(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function checkout() {
    setSubmitError('')
    if (!customerId) {
      setSubmitError('Choose a customer for this sale.')
      return
    }
    if (!items.length) {
      setSubmitError('Add at least one item before checkout.')
      return
    }
    if (paymentType === 'credit' && !dueDate) {
      setSubmitError('Due date is required for credit sale.')
      return
    }

    const payload = {
      customer: Number(customerId),
      payment_type: paymentType,
      items: items.map((it) => ({
        product: Number(it.product),
        quantity: Number(it.quantity),
        price: Number(it.price),
      })),
    }
    if (paymentType === 'credit') payload.due_date = dueDate

    setSubmitting(true)
    try {
      const created = await salesService.create(payload)
      setLastInvoice({
        saleId: created?.sell_id,
        date: created?.date,
        paymentType: created?.payment_type ?? paymentType,
        customerName: customerName(selectedCustomer),
        items,
        total: subtotal,
      })
      setItems([])
      setDueDate('')
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('posTitle')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {t('posSub')}
        </p>
      </header>

      {productsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {t('productLoadingFailed')}: {productsError}
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('buildSale')}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">{t('customer')}</span>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">{t('selectCustomer')}</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id ?? customer.id} value={customer.customer_id ?? customer.id}>
                    {customerName(customer)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">{t('paymentType')}</span>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="cash">{t('cash')}</option>
                <option value="credit">{t('credit')}</option>
              </select>
            </label>
          </div>

          {paymentType === 'credit' ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">{t('dueDate')}</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 md:col-span-2"
              disabled={productsLoading}
            >
              <option value="">{productsLoading ? t('loading') : t('selectProduct')}</option>
              {products.map((product) => (
                <option key={toProductId(product)} value={toProductId(product)}>
                  {product.name} ({t('stock')}: {product.current_stock ?? 0})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t('qty')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder={t('unitPrice')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="button"
            onClick={addLineItem}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {t('addItem')}
          </button>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">{t('navProducts')}</th>
                  <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">{t('qty')}</th>
                  <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">{t('unitPrice')}</th>
                  <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">{t('total')}</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.length ? (
                  items.map((item, idx) => (
                    <tr key={`${item.product}-${idx}`} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{item.product_name}</td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{item.quantity}</td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{item.price}</td>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                        {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="text-red-600 hover:underline dark:text-red-400"
                        >
                          {t('remove')}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-5 text-center text-slate-500 dark:text-slate-400">
                      {t('noItemsYet')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('invoiceSummary')}</h2>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{t('customer')}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {selectedCustomer ? customerName(selectedCustomer) : '-'}
              </span>
            </p>
            <p className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{t('paymentType')}</span>
              <span className="font-medium text-slate-900 capitalize dark:text-slate-100">{paymentType}</span>
            </p>
            <p className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{t('items')}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{items.length}</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('total')}</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {subtotal.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={checkout}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {submitting ? t('submitting') : t('checkoutSale')}
          </button>

          {lastInvoice ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
              <p className="font-semibold">{t('saleSuccess')}</p>
              <p className="mt-1">Sale ID: {lastInvoice.saleId ?? 'Generated'}</p>
              <p>Date: {lastInvoice.date ?? 'Today'}</p>
              <p>Customer: {lastInvoice.customerName}</p>
              <p>Total: {Number(lastInvoice.total).toFixed(2)}</p>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  )
}
