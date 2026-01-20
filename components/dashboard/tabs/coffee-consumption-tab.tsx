'use client'

import useSWR from 'swr'
import { getCoffeeConsumption } from '@/lib/api'
import { CoffeeConsumptionSection } from '../sections/coffee-consumption-section'

export function CoffeeConsumptionTab() {
  const { data, error, isLoading } = useSWR('coffee-consumption', getCoffeeConsumption)

  return (
    <div className="space-y-8">
      <CoffeeConsumptionSection data={data} isLoading={isLoading} error={error} />
    </div>
  )
}