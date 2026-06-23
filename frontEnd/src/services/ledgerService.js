import { get, post } from './api.js'

export const ledgerService = {
  list: (params) => get('ledger/', { params }).then((r) => r.data),
  customer: (id) => get(`ledger/customer/${id}/`).then((r) => r.data),
  supplier: (id) => get(`ledger/supplier/${id}/`).then((r) => r.data),
  summary: () => get('ledger/summary/').then((r) => r.data),
  overdue: () => get('ledger/overdue/').then((r) => r.data),
  payment: (payload) => post('ledger/payment/', payload).then((r) => r.data),
}
