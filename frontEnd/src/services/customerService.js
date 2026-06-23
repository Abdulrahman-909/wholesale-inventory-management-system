import { del, get, post, put } from './api.js'

export const customerService = {
  list: (params) => get('customers/', { params }).then((r) => r.data),
  detail: (id) => get(`customers/${id}/`).then((r) => r.data),
  create: (payload) => post('customers/', payload).then((r) => r.data),
  update: (id, payload) => put(`customers/${id}/`, payload).then((r) => r.data),
  remove: (id) => del(`customers/${id}/`).then((r) => r.data),
}
