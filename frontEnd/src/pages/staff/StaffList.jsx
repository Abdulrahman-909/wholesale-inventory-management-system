import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../services/api.js'
import { get } from '../../services/api.js'
import { createUserByAdmin, listUserAccounts } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'

export function StaffList() {
  const { isAdmin } = useAuth()
  const [staff, setStaff] = useState([])
  const [users, setUsers] = useState([])
  const [accountForm, setAccountForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'regular',
  })
  const [accountMessage, setAccountMessage] = useState('')
  const [error, setError] = useState('')

  async function loadStaff() {
    try {
      const response = await get('staff/')
      setStaff(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function loadUsers() {
    if (!isAdmin) return
    try {
      const data = await listUserAccounts()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Could not refresh users:', err)
    }
  }

  useEffect(() => {
    setError('')
    loadStaff()
    loadUsers()
  }, [isAdmin])

  async function handleCreateAccount(event) {
    event.preventDefault()
    setError('')
    setAccountMessage('')

    try {
      await createUserByAdmin(accountForm)

      setAccountMessage('User account created successfully.')
      setAccountForm({
        username: '',
        password: '',
        email: '',
        role: 'regular',
      })

      await loadUsers()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Staff
      </h1>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Job</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Address</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((person) => (
              <tr
                key={person.stuff_id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-3 py-2">
                  {person.first_name} {person.last_name}
                </td>
                <td className="px-3 py-2">{person.job_name || '-'}</td>
                <td className="px-3 py-2">{person.phone_number}</td>
                <td className="px-3 py-2">{person.address}</td>
              </tr>
            ))}

            {staff.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-3 text-slate-500">
                  No staff records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isAdmin ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Create login account
          </h2>

          <form onSubmit={handleCreateAccount} className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded border p-2"
              placeholder="Username"
              value={accountForm.username}
              onChange={(e) =>
                setAccountForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              required
            />

            <input
              className="rounded border p-2"
              placeholder="Password"
              type="text"
              value={accountForm.password}
              onChange={(e) =>
                setAccountForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
            />

            <input
              className="rounded border p-2"
              placeholder="Email (optional)"
              value={accountForm.email}
              onChange={(e) =>
                setAccountForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <select
              className="rounded border p-2"
              value={accountForm.role}
              onChange={(e) =>
                setAccountForm((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            >
              <option value="regular">Regular User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 md:col-span-2"
            >
              Create User Account
            </button>
          </form>

          {accountMessage ? (
            <p className="text-sm text-green-600 dark:text-green-400">
              {accountMessage}
            </p>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Username</th>
                  <th className="px-2 py-1 text-left">Email</th>
                  <th className="px-2 py-1 text-left">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <td className="px-2 py-1">{user.username}</td>
                    <td className="px-2 py-1">{user.email || '-'}</td>
                    <td className="px-2 py-1">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  )
}