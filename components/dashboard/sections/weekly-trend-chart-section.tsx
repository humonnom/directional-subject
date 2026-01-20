'use client'

import { formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { BarChart } from '../charts/bar-chart'
import { AreaChart } from '../charts/area-chart'

interface CategoryConfig {
  key: string
  label: string
  color: string
}

interface TrendChartSectionProps<T> {
  title: string
  data: T[] | undefined
  isLoading: boolean
  error: Error | undefined
  categories: CategoryConfig[]
  getWeek: (item: T) => string
  getValue: (item: T, key: string) => number
}

export function WeeklyTrendChartSection<T>({
  title,
  data,
  isLoading,
  error,
  categories,
  getWeek,
  getValue,
}: TrendChartSectionProps<T>) {
  const labels = data?.map(item => formatDate(getWeek(item))) ?? []

  const percentageData = data?.map(item => {
    const total = categories.reduce((sum, cat) => sum + getValue(item, cat.key), 0)
    return categories.reduce((acc, cat) => {
      acc[cat.key] = total ? (getValue(item, cat.key) / total) * 100 : 0
      return acc
    }, {} as Record<string, number>)
  }) ?? []

  const stackedBarData = {
    labels,
    datasets: categories.map(category => ({
      label: category.label,
      data: percentageData.map(d => d[category.key]),
      backgroundColor: category.color,
    })),
  }

  const stackedAreaData = {
    labels,
    datasets: categories.map(category => ({
      label: category.label,
      data: percentageData.map(d => d[category.key]),
      backgroundColor: `${category.color}80`,
      borderColor: category.color,
      fill: true,
    })),
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Stacked Bar Chart (%)" isLoading={isLoading} error={error?.message}>
          <BarChart data={stackedBarData} stacked />
        </ChartCard>
        <ChartCard title="Stacked Area Chart (%)" isLoading={isLoading} error={error?.message}>
          <AreaChart data={stackedAreaData} stacked />
        </ChartCard>
      </div>
    </section>
  )
}