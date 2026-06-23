import { del, get, post, put } from './api.js'

const PRODUCTS_PATH = 'products/'

/**
 * Django REST may return a plain array or a paginated `{ results: [...] }` payload.
 * @param {unknown} data
 * @returns {object[]}
 */
function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray(data.data)) {
    return data.data
  }
  if (data && typeof data === 'object' && Array.isArray(data.results)) {
    return data.results
  }
  return []
}

export async function fetchProducts() {
  const { data } = await get(PRODUCTS_PATH)
  return normalizeList(data)
}

export async function fetchProductById(id) {
  const { data } = await get(`${PRODUCTS_PATH}${id}/`)
  return data
}

export async function createProduct(payload) {
  const config =
    payload instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined
  const { data } = await post(PRODUCTS_PATH, payload, config)
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await put(`${PRODUCTS_PATH}${id}/`, payload)
  return data
}

export async function deleteProduct(id) {
  await del(`${PRODUCTS_PATH}${id}/`)
}
