'use client'

import useSWR from 'swr'
import { getTopCoffeeBrands } from '@/lib/api'
import { TopCoffeeBrandItem } from '@/lib/types'
import { BrandChartSection } from './brand-chart-section'

export function CoffeeBrandsSection() {
  const { data, error, isLoading } = useSWR('top-coffee-brands', getTopCoffeeBrands)

  return (
    <BrandChartSection<TopCoffeeBrandItem>
      title="Top Coffee Brands"
      data={data}
      isLoading={isLoading}
      error={error}
      getLabel={item => item.brand}
      getValue={item => item.popularity}
    />
  )
}