import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api.js'
import { fetchProductById } from '../services/productService.js'

/**
 * Loads a single product by id from the API.
 * @param {string | undefined} id
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!id) {
      setProduct(null)
      setLoading(false)
      setError('Missing product id')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProductById(id)
      setProduct(data)
    } catch (err) {
      setError(getErrorMessage(err))
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { product, loading, error, refetch: load }
}
