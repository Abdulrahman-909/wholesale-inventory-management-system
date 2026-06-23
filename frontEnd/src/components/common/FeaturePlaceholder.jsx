import { Link } from 'react-router-dom'

export function FeaturePlaceholder({ title, description, ctaTo, ctaText }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      {ctaTo ? (
        <Link
          to={ctaTo}
          className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          {ctaText ?? 'Open'}
        </Link>
      ) : null}
    </section>
  )
}
