export function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? idx} className="border-t border-slate-100 dark:border-slate-800">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
