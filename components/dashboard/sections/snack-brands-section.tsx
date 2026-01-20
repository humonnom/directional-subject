'use client'

import { getPopularSnackBrands } from '@/lib/api'
import { PopularSnackBrandItem } from '@/lib/types'
import { BrandChartSection } from './brand-chart-section'

export function SnackBrandsSection() {
  return (
    <BrandChartSection<PopularSnackBrandItem>
      title="Popular Snack Brands"
      swrKey="popular-snack-brands"
      fetcher={getPopularSnackBrands}
      getLabel={(item) => item.name}
      getValue={(item) => item.share}
    />
  )
}
