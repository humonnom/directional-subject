'use client'

import useSWR from 'swr'
import { getTopCoffeeBrands, getPopularSnackBrands } from '@/lib/api'
import { BrandChartSection } from '../sections/brand-chart-section'
import { TopCoffeeBrandItem, PopularSnackBrandItem } from '@/lib/types'

export function BrandTab() {
  const coffeeBrands = useSWR('top-coffee-brands', getTopCoffeeBrands)
  const snackBrands = useSWR('popular-snack-brands', getPopularSnackBrands)

  return (
    <div className="space-y-8">
      <BrandChartSection<TopCoffeeBrandItem>
        title="Top Coffee Brands"
        data={coffeeBrands.data}
        isLoading={coffeeBrands.isLoading}
        error={coffeeBrands.error}
        getLabel={item => item.brand}
        getValue={item => item.popularity}
      />
      <BrandChartSection<PopularSnackBrandItem>
        title="Popular Snack Brands"
        data={snackBrands.data}
        isLoading={snackBrands.isLoading}
        error={snackBrands.error}
        getLabel={item => item.name}
        getValue={item => item.share}
      />
    </div>
  )
}