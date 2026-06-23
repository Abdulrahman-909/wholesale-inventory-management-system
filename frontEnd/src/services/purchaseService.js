import { get, post } from './api.js'

export const purchaseService = {
  list: (params) => get('purchases/', { params }).then((r) => r.data),
  detail: (id) => get(`purchases/${id}/`).then((r) => r.data),
  create: (payload) => post('purchases/', payload).then((r) => r.data),
}
