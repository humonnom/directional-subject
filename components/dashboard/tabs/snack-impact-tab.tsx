'use client'

import useSWR from 'swr'
import { getSnackImpact } from '@/lib/api'
import { SnackImpactSection } from '../sections/snack-impact-section'

export function SnackImpactTab() {
  const { data, error, isLoading } = useSWR('snack-impact', getSnackImpact)

  return (
    <div className="space-y-8">
      <SnackImpactSection data={data} isLoading={isLoading} error={error} />
    </div>
  )
}