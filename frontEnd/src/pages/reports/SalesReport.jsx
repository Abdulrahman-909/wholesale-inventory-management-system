import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { reportService } from '../../services/reportService.js'
import { getErrorMessage } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export function SalesReport() {
  const { isAdmin } = useAuth()
  const [comparison, setComparison] = useState(null)
  const [inbox, setInbox] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    reportService
      .salesMonthlyComparison()
      .then(setComparison)
      .catch((err) => setError(getErrorMessage(err)))

    if (isAdmin) {
      reportService
        .inbox()
        .then((inboxData) => setInbox(Array.isArray(inboxData) ? inboxData : []))
        .catch((err) => setError(getErrorMessage(err)))
    }
  }, [isAdmin])

  async function handleStatusChange(reportId, statusValue) {
    try {
      await reportService.updateStatus(reportId, statusValue)
      const inboxData = await reportService.inbox()
      setInbox(Array.isArray(inboxData) ? inboxData : [])
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const monthChartData = comparison
    ? [
        { month: 'Last Month', sales: Number(comparison.last_month_total || 0) },
        { month: 'Current Month', sales: Number(comparison.current_month_total || 0) },
      ]
    : []

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Sales Report</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-3 text-lg font-semibold">Last month vs current month</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      {isAdmin ? (
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Admin report inbox</h2>
          <div className="mt-3 space-y-3">
            {inbox.map((report) => (
              <div key={report.report_id} className="rounded border p-3">
                <p className="font-medium">{report.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{report.description}</p>
                <p className="text-xs text-slate-500">By: {report.created_by_username}</p>
                {report.attachments?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.attachments.map((file) => (
                      <a key={file.attachment_id} href={file.file_url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 hover:underline dark:text-emerald-400">
                        Attachment {file.attachment_id}
                      </a>
                    ))}
                  </div>
                ) : null}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm">Status: {report.status}</span>
                  <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => handleStatusChange(report.report_id, 'in_review')}>
                    Mark in review
                  </button>
                  <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => handleStatusChange(report.report_id, 'resolved')}>
                    Mark resolved
                  </button>
                </div>
              </div>
            ))}
            {inbox.length === 0 ? <p className="text-sm text-slate-500">No submitted reports yet.</p> : null}
          </div>
        </article>
      ) : null}
    </section>
  )
}
