export function ErrorAlert({ message }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
      {message}
    </div>
  )
}
