import axios from 'axios'

/**
 * Axios instance for the Django REST API.
 * Ensure your Django project allows this origin (django-cors-headers) in development.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isUnauthorized = error.response?.status === 401
    const isRefreshCall = originalRequest?.url?.includes('auth/refresh/')
    const retried = originalRequest?._retry

    if (!isUnauthorized || isRefreshCall || retried) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      const refreshResponse = await api.post('auth/refresh/', { refresh: refreshToken })
      const newAccess = refreshResponse.data?.access
      const newRefresh = refreshResponse.data?.refresh
      if (newAccess) localStorage.setItem('accessToken', newAccess)
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh)
      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return api(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return Promise.reject(refreshError)
    }
  },
)

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      const detail = data.detail ?? data.message
      if (typeof detail === 'string') return detail
      const firstKey = Object.keys(data)[0]
      const val = firstKey ? data[firstKey] : null
      if (Array.isArray(val)) return `${firstKey}: ${val[0]}`
      if (typeof val === 'string') return val
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export const get = (url, config) => api.get(url, config)
export const post = (url, data, config) => api.post(url, data, config)
export const put = (url, data, config) => api.put(url, data, config)
export const patch = (url, data, config) => api.patch(url, data, config)
export const del = (url, config) => api.delete(url, config)

export default api
