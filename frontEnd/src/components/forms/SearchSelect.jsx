import { useMemo, useState } from 'react'

export function SearchSelect({ options = [], onSelect, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )
  return (
    <div className="space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      <div className="max-h-40 overflow-auto rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {filtered.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option)}
            className="block w-full px-3 py-2 text-left text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
