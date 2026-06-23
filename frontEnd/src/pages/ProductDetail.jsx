import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { useProduct } from '../hooks/useProduct.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatCurrency } from '../utils/formatters.js'
import { getMediaUrl } from '../utils/media.js'

const SKIP_DETAIL_KEYS = new Set([
  'id',
  'pk',
  'name',
  'title',
  'description',
  'summary',
  'price',
  'unit_price',
  'image',
  'image_url',
  'thumbnail',
  'photo',
])

function ExtraFields({ product }) {
  const entries = Object.entries(product).filter(([key, value]) => {
    if (SKIP_DETAIL_KEYS.has(key)) return false
    if (value === null || value === undefined || value === '') return false
    if (typeof value === 'object') return false
    return true
  })

  if (entries.length === 0) return null

  return (
    <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-700 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {key}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {String(value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return formatCurrency(n)
}

export function ProductDetail() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const { product, loading, error, refetch } = useProduct(id)

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-600 dark:text-slate-400">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            role="status"
            aria-label="Loading"
          />
          <p>Loading product…</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          <p className="font-semibold">Could not load this product</p>
          <p className="mt-2 text-sm opacity-90">{error ?? 'Not found.'}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => refetch()}>
              Try again
            </Button>

            <Link to="/products">
              <Button variant="outline" type="button">
                Back to list
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const name = product.name ?? product.title ?? 'Product'
  const description = product.description ?? product.summary ?? ''
  const price = product.price ?? product.unit_price
  const rawImage =
    product.image ?? product.image_url ?? product.thumbnail ?? product.photo
  const image = getMediaUrl(rawImage)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        to="/products"
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
      >
        ← Back to products
      </Link>

      <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        {image ? (
          <img
            src={image}
            alt=""
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-slate-100 text-slate-500 sm:aspect-[21/9] dark:bg-slate-800">
            No image
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                {name}
              </h1>

              <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {formatPrice(price)}
              </p>
            </div>

            {isAdmin ? (
              <Link to={`/products/${id}/edit`}>
                <Button type="button">Edit Product</Button>
              </Link>
            ) : null}
          </div>

          {description ? (
            <p className="mt-4 whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : (
            <p className="mt-4 text-slate-500 dark:text-slate-500">
              No description.
            </p>
          )}

          <ExtraFields product={product} />
        </div>
      </article>
    </div>
  )
}