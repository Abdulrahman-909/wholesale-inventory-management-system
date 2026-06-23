import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api.js'
import { fetchProducts } from '../services/productService.js'

/**
 * Loads the product list from the API with loading and error state.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchProducts()
      setProducts(list)
    } catch (err) {
      setError(getErrorMessage(err))
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, refetch: load }
}
