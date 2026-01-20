'use client'

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, removeAuthToken } from './api'

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const emptySubscribe = () => () => {}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const router = useRouter()

  const isLoggedIn = isMounted ? isAuthenticated() : false
  const isLoading = !isMounted

  const checkAuth = useCallback(() => {
    // Force re-render by router refresh if needed
  }, [])

  const logout = useCallback(() => {
    removeAuthToken()
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
