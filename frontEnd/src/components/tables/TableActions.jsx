import { Link } from 'react-router-dom'

export function TableActions({ viewTo, editTo, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {viewTo ? (
        <Link to={viewTo} className="text-emerald-700 hover:underline dark:text-emerald-400">
          View
        </Link>
      ) : null}
      {editTo ? (
        <Link to={editTo} className="text-slate-700 hover:underline dark:text-slate-200">
          Edit
        </Link>
      ) : null}
      {onDelete ? (
        <button type="button" onClick={onDelete} className="text-red-700 hover:underline dark:text-red-400">
          Delete
        </button>
      ) : null}
    </div>
  )
}
