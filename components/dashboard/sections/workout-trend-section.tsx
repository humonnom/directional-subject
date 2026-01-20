'use client'

import useSWR from 'swr'
import { getWeeklyWorkoutTrend } from '@/lib/api'
import { CHART_COLORS, formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { BarChart } from '../charts/bar-chart'
import { AreaChart } from '../charts/area-chart'

export function WorkoutTrendSection() {
  const { data, error, isLoading } = useSWR('weekly-workout-trend', getWeeklyWorkoutTrend)

  const labels = data?.items.map(item => formatDate(item.week)) ?? []
  
  // Percentage data for stacked charts
  const percentageData = data?.items.map(item => {
    const total = item.cardio + item.strength + item.yoga
    return {
      cardio: total ? (item.cardio / total) * 100 : 0,
      strength: total ? (item.strength / total) * 100 : 0,
      yoga: total ? (item.yoga / total) * 100 : 0,
    }
  }) ?? []

  const stackedBarData = {
    labels,
    datasets: [
      {
        label: 'Cardio',
        data: percentageData.map(d => d.cardio),
        backgroundColor: CHART_COLORS.cardio,
      },
      {
        label: 'Strength',
        data: percentageData.map(d => d.strength),
        backgroundColor: CHART_COLORS.strength,
      },
      {
        label: 'Yoga',
        data: percentageData.map(d => d.yoga),
        backgroundColor: CHART_COLORS.yoga,
      },
    ],
  }

  const stackedAreaData = {
    labels,
    datasets: [
      {
        label: 'Cardio',
        data: percentageData.map(d => d.cardio),
        backgroundColor: `${CHART_COLORS.cardio}80`,
        borderColor: CHART_COLORS.cardio,
        fill: true,
      },
      {
        label: 'Strength',
        data: percentageData.map(d => d.strength),
        backgroundColor: `${CHART_COLORS.strength}80`,
        borderColor: CHART_COLORS.strength,
        fill: true,
      },
      {
        label: 'Yoga',
        data: percentageData.map(d => d.yoga),
        backgroundColor: `${CHART_COLORS.yoga}80`,
        borderColor: CHART_COLORS.yoga,
        fill: true,
      },
    ],
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Weekly Workout Trend</h2>
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
