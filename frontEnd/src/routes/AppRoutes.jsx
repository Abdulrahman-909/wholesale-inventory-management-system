import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout.jsx'
import { AuthLayout } from '../layouts/AuthLayout.jsx'
import { Home } from '../pages/Home.jsx'
import { Login } from '../pages/auth/Login.jsx'
import { Dashboard } from '../pages/dashboard/Dashboard.jsx'
import { ProductList } from '../pages/products/ProductList.jsx'
import { ProductDetail } from '../pages/products/ProductDetail.jsx'
import { ProductForm } from '../pages/products/ProductForm.jsx'
import { PointOfSale } from '../pages/pos/PointOfSale.jsx'
import { PurchaseList } from '../pages/purchases/PurchaseList.jsx'
import { PurchaseForm } from '../pages/purchases/PurchaseForm.jsx'
import { CustomerList } from '../pages/customers/CustomerList.jsx'
import { CustomerForm } from '../pages/customers/CustomerForm.jsx'
import { SupplierList } from '../pages/suppliers/SupplierList.jsx'
import { SupplierForm } from '../pages/suppliers/SupplierForm.jsx'
import { StockList } from '../pages/stock/StockList.jsx'
import { StockDetail } from '../pages/stock/StockDetail.jsx'
import { LedgerList } from '../pages/ledger/LedgerList.jsx'
import { CustomerLedger } from '../pages/ledger/CustomerLedger.jsx'
import { SupplierLedger } from '../pages/ledger/SupplierLedger.jsx'
import { DailyReport } from '../pages/reports/DailyReport.jsx'
import { SalesReport } from '../pages/reports/SalesReport.jsx'
import { StaffList } from '../pages/staff/StaffList.jsx'
import { Profile } from '../pages/profile/Profile.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600 dark:text-slate-300">
        {t('loading')}
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600 dark:text-slate-300">
        {t('loading')}
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return isAdmin ? children : <Navigate to="/dashboard" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/products" element={<ProductList />} />
        <Route
          path="/products/new"
          element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          }
        />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route
          path="/pos"
          element={
            <AdminRoute>
              <PointOfSale />
            </AdminRoute>
          }
        />

        <Route path="/purchases" element={<PurchaseList />} />
        <Route
          path="/purchases/new"
          element={
            <AdminRoute>
              <PurchaseForm />
            </AdminRoute>
          }
        />

        <Route path="/customers" element={<CustomerList />} />
        <Route
          path="/customers/new"
          element={
            <AdminRoute>
              <CustomerForm />
            </AdminRoute>
          }
        />
        <Route
          path="/customers/:id/edit"
          element={
            <AdminRoute>
              <CustomerForm />
            </AdminRoute>
          }
        />

        <Route path="/suppliers" element={<SupplierList />} />
        <Route
          path="/suppliers/new"
          element={
            <AdminRoute>
              <SupplierForm />
            </AdminRoute>
          }
        />
        <Route
          path="/suppliers/:id/edit"
          element={
            <AdminRoute>
              <SupplierForm />
            </AdminRoute>
          }
        />

        <Route path="/stock" element={<StockList />} />
        <Route path="/stock/:id" element={<StockDetail />} />

        <Route path="/ledger" element={<LedgerList />} />
        <Route path="/ledger/customer/:id" element={<CustomerLedger />} />
        <Route path="/ledger/supplier/:id" element={<SupplierLedger />} />

        <Route path="/reports/daily" element={<DailyReport />} />
        <Route path="/reports/sales" element={<SalesReport />} />

        <Route
          path="/staff"
          element={
            <AdminRoute>
              <StaffList />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}