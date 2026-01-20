'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { isAuthenticated } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BrandTab } from '@/components/dashboard/tabs/brand-tab'
import { WeeklyTrendTab } from '@/components/dashboard/tabs/weekly-trend-tab'

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
        <h1 className="mb-6 text-2xl font-bold">Data Visualization Dashboard</h1>
        <Tabs defaultValue="brand">
          <TabsList>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Trend</TabsTrigger>
          </TabsList>
          <TabsContent value="brand" className="pt-4">
            <BrandTab />
          </TabsContent>
          <TabsContent value="weekly" className="pt-4">
            <WeeklyTrendTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}