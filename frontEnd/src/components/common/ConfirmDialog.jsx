export function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="rounded-md bg-red-600 px-3 py-1.5 text-white">
          Confirm
        </button>
      </div>
    </div>
  )
}
