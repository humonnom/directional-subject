'use client'

import useSWR from 'swr'
import { getSnackImpact } from '@/lib/api'
import { CHART_COLORS, formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { MultiLineChart } from '../charts/multi-line-chart'
import type { SnackImpactDepartment } from '@/lib/types'

export function SnackImpactSection() {
  const { data, error, isLoading } = useSWR('snack-impact', getSnackImpact)

  // Get all unique dates from the first department's data
  const labels = data?.series[0]?.data.map(d => formatDate(d.date)) ?? []

  const datasets = data?.series.flatMap(({ department, data: deptData }) => {
    const deptColor = CHART_COLORS[department as SnackImpactDepartment] ?? '#6b7280'
    
    return [
      {
        label: `${department} - Satisfaction`,
        data: deptData.map(d => d.satisfaction),
        borderColor: deptColor,
        backgroundColor: deptColor,
        yAxisID: 'y',
        borderDash: [],
        pointStyle: 'circle' as const,
      },
      {
        label: `${department} - Stress`,
        data: deptData.map(d => d.stress),
        borderColor: deptColor,
        backgroundColor: deptColor,
        yAxisID: 'y1',
        borderDash: [5, 5],
        pointStyle: 'rect' as const,
      },
    ]
  }) ?? []

  const chartData = {
    labels,
    datasets,
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Snack Impact</h2>
      <ChartCard 
        title="Satisfaction vs Stress by Department" 
        isLoading={isLoading} 
        error={error?.message}
        className="col-span-full"
      >
        <MultiLineChart
          data={chartData}
          dualYAxis
          leftAxisLabel="Satisfaction"
          rightAxisLabel="Stress"
        />
      </ChartCard>
    </section>
  )
}
