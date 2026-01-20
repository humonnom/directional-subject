'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, removeAuthToken } from './api'

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated())
  const [isLoading] = useState(false)
  const router = useRouter()

  const checkAuth = useCallback(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  const logout = useCallback(() => {
    removeAuthToken()
    setIsLoggedIn(false)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
