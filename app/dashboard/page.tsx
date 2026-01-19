'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { isAuthenticated } from '@/lib/api'
import { LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">대시보드</h1>
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center gap-4">
            <LayoutDashboard className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">준비 중입니다.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
