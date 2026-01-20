'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { isAuthenticated } from '@/lib/api'
import { MoodTrendSection } from '@/components/dashboard/sections/mood-trend-section'
import { SnackBrandsSection } from '@/components/dashboard/sections/snack-brands-section'
import { WorkoutTrendSection } from '@/components/dashboard/sections/workout-trend-section'
import { CoffeeConsumptionSection } from '@/components/dashboard/sections/coffee-consumption-section'
import { SnackImpactSection } from '@/components/dashboard/sections/snack-impact-section'

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
        <div className="space-y-8">
          {/*<TopCoffeeBrandsSection/>*/}
          <SnackBrandsSection />
          {/*<MoodTrendSection />*/}
          {/*<WorkoutTrendSection />*/}
          {/*<CoffeeConsumptionSection />*/}
          {/*<SnackImpactSection />*/}
        </div>
      </main>
    </div>
  )
}
