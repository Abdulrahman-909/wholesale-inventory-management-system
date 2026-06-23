import { useMemo, useState } from 'react'
import { Card } from '../components/Card.jsx'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function productSearchText(p) {
  const name = String(p.name ?? p.title ?? '')
  const desc = String(p.description ?? p.summary ?? '')
  const sku = String(p.sku ?? '')
  return `${name} ${desc} ${sku}`.toLowerCase()
}

export function ProductList() {
  const { isAdmin } = useAuth()
  const { products, loading, error, refetch } = useProducts()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => productSearchText(p).includes(q))
  }, [products, query])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-600 dark:text-slate-400">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            role="status"
            aria-label="Loading"
          />
          <p>Loading products…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          <p className="font-semibold">Could not load products</p>
          <p className="mt-2 text-sm opacity-90">{error}</p>
          <Button type="button" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
           products
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {filtered.length} of {products.length} shown
            {query.trim() ? ` · filtered by “${query.trim()}”` : ''}
          </p>
        </div>
        <div className="w-full max-w-md">
          <Input
            label="Search"
            name="search"
            type="search"
            placeholder="Search by name, description, or SKU…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      {isAdmin ? (
        <div className="mt-4">
          <Link to="/products/new">
            <Button type="button">Create Product</Button>
          </Link>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-slate-600 dark:text-slate-400">
          {products.length === 0
            ? 'No products yet. Add one from the menu.'
            : 'No products match your search.'}
        </p>
      ) : (
        <ul className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const key = product.id ?? product.pk ?? product.product_id ?? JSON.stringify(product)
            return (
              <li key={key}>
                <Card product={product} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
