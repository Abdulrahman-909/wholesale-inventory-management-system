import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatters.js'
import { getMediaUrl } from '../utils/media.js'

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return formatCurrency(n)
}

/**
 * Product card for grid layouts. Works with common Django REST field names.
 */
export function Card({ product }) {
  const id = product.id ?? product.pk ?? product.product_id
  const name = product.name ?? product.title ?? 'Untitled product'
  const description = product.description ?? product.summary ?? ''
  const price = product.price ?? product.unit_price
  const rawImage =
    product.image ??
    product.image_url ??
    product.thumbnail ??
    product.photo
  const image = getMediaUrl(rawImage)
  const stock = product.current_stock

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-emerald-500/40">
      <Link to={`/products/${id}`} className="block shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {image ? (
          <img
            src={image}
            alt=""
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="text-sm">No image</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-1 flex-col gap-1">
          <Link
            to={`/products/${id}`}
            className="text-left text-lg font-semibold text-slate-900 decoration-emerald-600 underline-offset-4 hover:underline dark:text-white"
          >
            {name}
          </Link>
          {description ? (
            <p className="line-clamp-2 text-left text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
            {formatPrice(price)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Stock: {stock ?? 0}</span>
          <Link
            to={`/products/${id}`}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  )
}
