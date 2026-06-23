import { useCallback, useState } from 'react'
import { getErrorMessage } from '../services/api.js'

export function useApi(requestFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        return await requestFn(...args)
      } catch (err) {
        setError(getErrorMessage(err))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [requestFn],
  )

  return { execute, loading, error, setError }
}
