import { get, post } from './api.js'

export const saleService = {
  list: (params) => get('sales/', { params }).then((r) => r.data),
  detail: (id) => get(`sales/${id}/`).then((r) => r.data),
  create: (payload) => post('sales/', payload).then((r) => r.data),
}
