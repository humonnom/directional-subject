'use client'

import useSWR from 'swr'
import { getWeeklyMoodTrend } from '@/lib/api'
import { CHART_COLORS, convertToPercentage, formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { BarChart } from '../charts/bar-chart'
import { DoughnutChart } from '../charts/doughnut-chart'
import { AreaChart } from '../charts/area-chart'

export function MoodTrendSection() {
  const { data, error, isLoading } = useSWR('weekly-mood-trend', getWeeklyMoodTrend)

  const labels = data?.map(item => formatDate(item.week)) ?? []

  // Percentage data for stacked charts
  const percentageData = data?.map(item => {
    const total = item.happy + item.stressed + item.tired
    return {
      happy: total ? (item.happy / total) * 100 : 0,
      stressed: total ? (item.stressed / total) * 100 : 0,
      tired: total ? (item.tired / total) * 100 : 0,
    }
  }) ?? []

  const stackedBarData = {
    labels,
    datasets: [
      {
        label: 'Happy',
        data: percentageData.map(d => d.happy),
        backgroundColor: CHART_COLORS.happy,
      },
      {
        label: 'stressed',
        data: percentageData.map(d => d.stressed),
        backgroundColor: CHART_COLORS.stressed,
      },
      {
        label: 'tired',
        data: percentageData.map(d => d.tired),
        backgroundColor: CHART_COLORS.tired,
      },
    ],
  }

  const stackedAreaData = {
    labels,
    datasets: [
      {
        label: 'Happy',
        data: percentageData.map(d => d.happy),
        backgroundColor: `${CHART_COLORS.happy}80`,
        borderColor: CHART_COLORS.happy,
        fill: true,
      },
      {
        label: 'stressed',
        data: percentageData.map(d => d.stressed),
        backgroundColor: `${CHART_COLORS.stressed}80`,
        borderColor: CHART_COLORS.stressed,
        fill: true,
      },
      {
        label: 'tired',
        data: percentageData.map(d => d.tired),
        backgroundColor: `${CHART_COLORS.tired}80`,
        borderColor: CHART_COLORS.tired,
        fill: true,
      },
    ],
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Weekly Mood Trend</h2>
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
