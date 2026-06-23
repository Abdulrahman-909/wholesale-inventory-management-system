import { get } from './api.js'

export const stockService = {
  list: (params) => get('stocks/', { params }).then((r) => r.data),
  productStock: (productId) => get(`stocks/product/${productId}/`).then((r) => r.data),
  summary: () => get('stocks/summary/').then((r) => r.data),
  warehouseStock: (warehouseId) => get(`warehouse/${warehouseId}/stock/`).then((r) => r.data),
}
