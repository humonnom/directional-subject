'use client'

import useSWR from 'swr'
import { getPopularSnackBrands } from '@/lib/api'
import { PopularSnackBrandItem } from '@/lib/types'
import { BrandChartSection } from './brand-chart-section'

export function SnackBrandsSection() {
  const { data, error, isLoading } = useSWR('popular-snack-brands', getPopularSnackBrands)

  return (
    <BrandChartSection<PopularSnackBrandItem>
      title="Popular Snack Brands"
      data={data}
      isLoading={isLoading}
      error={error}
      getLabel={item => item.name}
      getValue={item => item.share}
    />
  )
}