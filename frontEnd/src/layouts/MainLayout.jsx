import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar.jsx'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
