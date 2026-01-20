'use client'

import { getTopCoffeeBrands } from '@/lib/api'
import { TopCoffeeBrandItem } from '@/lib/types'
import { BrandChartSection } from './brand-chart-section'

export function CoffeeBrandsSection() {
  return (
    <BrandChartSection<TopCoffeeBrandItem>
      title="Top Coffee Brands"
      swrKey="top-coffee-brands"
      fetcher={getTopCoffeeBrands}
      getLabel={(item) => item.brand}
      getValue={(item) => item.popularity}
    />
  )
}
