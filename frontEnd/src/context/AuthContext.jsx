/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, fetchProfile } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const profile = await fetchProfile()
        setUser(profile)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.is_admin || user?.role === 'admin',
      async login(credentials) {
        const data = await loginUser(credentials)
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        const profile = await fetchProfile()
        setUser(profile)
      },
      logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
