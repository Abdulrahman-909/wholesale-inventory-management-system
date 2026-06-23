import { get, patch, post } from './api.js'

export const reportService = {
  daily: () => get('reports/daily/').then((r) => r.data),
  salesByDate: (year, month, day) =>
    get(`reports/sales/${year}/${month}/${day}/`).then((r) => r.data),
  dashboardStats: () => get('dashboard/stats/').then((r) => r.data),
  salesMonthlyComparison: () => get('sales/monthly-comparison/').then((r) => r.data),
  submit: (formData) =>
    post('reports/submit/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  chat: () => get('reports/chat/').then((r) => r.data),
  mine: () => get('reports/my/').then((r) => r.data),
  inbox: () => get('reports/inbox/').then((r) => r.data),
  updateStatus: (reportId, statusValue) =>
    patch(`reports/${reportId}/status/`, { status: statusValue }).then((r) => r.data),
}
