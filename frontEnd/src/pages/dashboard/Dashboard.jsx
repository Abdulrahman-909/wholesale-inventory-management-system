import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportService } from '../../services/reportService.js'
import { useI18n } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function Dashboard() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const baseStats = await reportService.dashboardStats()
        setStats(baseStats)
        if (isAdmin) {
          const salesComparison = await reportService.salesMonthlyComparison()
          setComparison(salesComparison)
        }
      } catch {
        setStats({})
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [isAdmin])

  const cards = [
    [t('todaySales'), stats?.today_sales_count ?? stats?.sales_count ?? 0],
    [t('todayRevenue'), stats?.today_revenue ?? stats?.revenue ?? 0],
    [t('totalProducts'), stats?.total_products ?? stats?.products_count ?? 0],
    [t('totalCustomers'), stats?.total_customers ?? stats?.customers_count ?? 0],
  ]

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-sm dark:border-slate-800">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('dashboardTitle')}</h1>
        <p className="mt-2 text-sm text-emerald-100 sm:text-base">
          {t('dashboardSub')}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {loading ? '...' : value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('quickActions')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {isAdmin ? (
              <>
                <Link className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm text-white hover:bg-emerald-700" to="/products/new">
                  {t('add products')}
                </Link>
                <Link className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm text-white dark:bg-slate-100 dark:text-slate-900" to="/pos">
                  {t('openPos')}
                </Link>
                <Link className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" to="/purchases/new">
                  {t('newPurchase')}
                </Link>
              </>
            ) : (
              <div className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                You have read-only access.
              </div>
            )}
            <Link className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" to="/reports/daily">
              {t('dailyReport')}
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('stockInsight')}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {loading
              ? t('stockInsightLoading')
              : `${t('lowStockProducts')}: ${stats?.low_stock_count ?? 0}`}
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('dashboardEmptyHint')}
          </p>
          <Link
            to="/products"
            className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t('viewProducts')}
          </Link>
        </article>
      </div>
      {isAdmin && comparison ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sales Comparison</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last month vs current month sales totals.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: 'Last month', sales: Number(comparison.last_month_total || 0) },
                  { month: 'Current month', sales: Number(comparison.current_month_total || 0) },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      ) : null}
    </section>
  )
}
