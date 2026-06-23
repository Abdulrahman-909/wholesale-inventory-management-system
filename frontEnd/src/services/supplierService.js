import { del, get, post, put } from './api.js'

export const supplierService = {
  list: (params) => get('suppliers/', { params }).then((r) => r.data),
  detail: (id) => get(`suppliers/${id}/`).then((r) => r.data),
  create: (payload) => post('suppliers/', payload).then((r) => r.data),
  update: (id, payload) => put(`suppliers/${id}/`, payload).then((r) => r.data),
  remove: (id) => del(`suppliers/${id}/`).then((r) => r.data),
}
