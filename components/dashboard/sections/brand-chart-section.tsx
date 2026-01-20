'use client'

import { BRAND_COLORS } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { BarChart } from '../charts/bar-chart'
import { DoughnutChart } from '../charts/doughnut-chart'

interface BrandChartSectionProps<T> {
  title: string
  data: T[] | undefined
  isLoading: boolean
  error: Error | undefined
  getLabel: (item: T) => string
  getValue: (item: T) => number
}

export function BrandChartSection<T>({
  title,
  data,
  isLoading,
  error,
  getLabel,
  getValue,
}: BrandChartSectionProps<T>) {
  const labels = data?.map(getLabel) ?? []
  const counts = data?.map(getValue) ?? []

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Count',
        data: counts,
        backgroundColor: BRAND_COLORS.slice(0, labels.length),
      },
    ],
  }

  const doughnutData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: BRAND_COLORS.slice(0, labels.length),
        borderWidth: 0,
      },
    ],
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Bar Chart" isLoading={isLoading} error={error?.message}>
          <BarChart data={barChartData} />
        </ChartCard>
        <ChartCard title="Doughnut Chart" isLoading={isLoading} error={error?.message}>
          <DoughnutChart data={doughnutData} />
        </ChartCard>
      </div>
    </section>
  )
}