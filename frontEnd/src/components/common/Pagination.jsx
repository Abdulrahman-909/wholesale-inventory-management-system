export function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded border border-slate-300 px-3 py-1.5 text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
      >
        Prev
      </button>
      <span className="text-sm text-slate-600 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border border-slate-300 px-3 py-1.5 text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
      >
        Next
      </button>
    </div>
  )
}
