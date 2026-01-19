'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/api'

interface UseAuthGuardOptions {
  /** 인증이 필요한 페이지인지 여부 (기본값: true) */
  requireAuth?: boolean
  /** 리다이렉트할 경로 */
  redirectTo?: string
}

/**
 * 인증 상태에 따라 페이지 접근을 제어하는 훅
 *
 * @example
 * // 인증 필요 페이지 (미인증시 /login으로 이동)
 * useAuthGuard()
 *
 * @example
 * // 비인증 페이지 (인증시 /posts로 이동)
 * useAuthGuard({ requireAuth: false, redirectTo: '/posts' })
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAuth = true, redirectTo } = options
  const router = useRouter()

  useEffect(() => {
    const authenticated = isAuthenticated()

    if (requireAuth && !authenticated) {
      router.replace(redirectTo ?? '/login')
    } else if (!requireAuth && authenticated) {
      router.replace(redirectTo ?? '/posts')
    }
  }, [router, requireAuth, redirectTo])
}