const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export function getMediaUrl(path) {
  if (typeof path !== 'string' || path.length === 0) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return path.startsWith('/') ? `${API_ORIGIN}${path}` : path
}
