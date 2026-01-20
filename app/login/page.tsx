'use client'

import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { login, setAuthToken } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useAuthGuard } from '@/lib/hooks/use-auth-guard'

export default function LoginPage() {
  useAuthGuard({ requireAuth: false, redirectTo: '/posts' })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { checkAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const response = await login({ email, password })

      if (response.token) {
        setAuthToken(response.token)
        checkAuth()
        toast.success('로그인되었습니다.')
        router.push('/posts')
      } else {
        toast.error('토큰이 응답에 없습니다.')
      }
    } catch {
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">게시판</CardTitle>
          <p className="text-muted-foreground text-sm">로그인하여 계속하세요</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <LoadingButton
              type="submit"
              className="mt-2 w-full"
              isLoading={isLoading}
              loadingText="로그인 중..."
            >
              로그인
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
