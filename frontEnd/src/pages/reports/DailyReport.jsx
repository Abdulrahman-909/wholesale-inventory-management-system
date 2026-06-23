import { useEffect, useState } from 'react'
import { reportService } from '../../services/reportService.js'
import { getErrorMessage } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export function DailyReport() {
  const { user } = useAuth()
  const [chatMessages, setChatMessages] = useState([])
  const [title, setTitle] = useState('General')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadChat() {
    try {
      const messages = await reportService.chat()
      setChatMessages(Array.isArray(messages) ? messages : [])
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => {
    reportService
      .chat()
      .then((messages) => setChatMessages(Array.isArray(messages) ? messages : []))
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      for (const file of files) {
        formData.append('files', file)
      }
      await reportService.submit(formData)
      setTitle('General')
      setDescription('')
      setFiles([])
      setMessage('Message sent.')
      await loadChat()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Reports Chat</h1>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Send message</h2>
        <input className="w-full rounded border p-2" placeholder="Topic" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full rounded border p-2" rows={4} placeholder="Write your message..." value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Send</button>
        {message ? <p className="text-sm text-green-600 dark:text-green-400">{message}</p> : null}
      </form>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Conversation</h2>
        <ul className="mt-3 max-h-[26rem] space-y-3 overflow-y-auto">
          {chatMessages.map((report) => (
            <li
              key={report.report_id}
              className={`rounded border p-3 ${
                report.created_by === user?.id
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <p className="text-sm font-medium">
                {report.created_by_username} ({report.created_by_role})
              </p>
              <p className="text-xs text-slate-500">{new Date(report.created_at).toLocaleString()}</p>
              <p className="mt-2 text-sm font-semibold">{report.title}</p>
              <p className="text-sm">{report.description}</p>
              {report.attachments?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.attachments.map((file) => (
                    <a
                      key={file.attachment_id}
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      Attachment {file.attachment_id}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
          {chatMessages.length === 0 ? <li className="text-sm text-slate-500">No messages yet.</li> : null}
        </ul>
      </div>
    </section>
  )
}
