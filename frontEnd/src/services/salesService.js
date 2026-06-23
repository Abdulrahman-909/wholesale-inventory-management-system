import { get, post } from './api.js'

export const salesService = {
  list: () => get('sales/').then((r) => r.data),
  create: (payload) => post('sales/', payload).then((r) => r.data),
}
