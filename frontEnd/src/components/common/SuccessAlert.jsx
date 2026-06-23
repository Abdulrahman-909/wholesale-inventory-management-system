export function SuccessAlert({ message }) {
  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200">
      {message}
    </div>
  )
}
