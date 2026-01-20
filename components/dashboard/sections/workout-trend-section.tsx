'use client'

import useSWR from 'swr'
import { getWeeklyWorkoutTrend } from '@/lib/api'
import { CHART_COLORS, formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { BarChart } from '../charts/bar-chart'
import { AreaChart } from '../charts/area-chart'

export function WorkoutTrendSection() {
  const { data, error, isLoading } = useSWR('weekly-workout-trend', getWeeklyWorkoutTrend)

  const labels = data?.map(item => formatDate(item.week)) ?? []
  
  // Percentage data for stacked charts
  const percentageData = data?.map(item => {
    const total = item.running + item.cycling + item.stretching
    return {
      running: total ? (item.running / total) * 100 : 0,
      cycling: total ? (item.cycling / total) * 100 : 0,
      stretching: total ? (item.stretching / total) * 100 : 0,
    }
  }) ?? []

  const stackedBarData = {
    labels,
    datasets: [
      {
        label: 'running',
        data: percentageData.map(d => d.running),
        backgroundColor: CHART_COLORS.running,
      },
      {
        label: 'cycling',
        data: percentageData.map(d => d.cycling),
        backgroundColor: CHART_COLORS.cycling,
      },
      {
        label: 'stretching',
        data: percentageData.map(d => d.stretching),
        backgroundColor: CHART_COLORS.stretching,
      },
    ],
  }

  const stackedAreaData = {
    labels,
    datasets: [
      {
        label: 'running',
        data: percentageData.map(d => d.running),
        backgroundColor: `${CHART_COLORS.running}80`,
        borderColor: CHART_COLORS.running,
        fill: true,
      },
      {
        label: 'cycling',
        data: percentageData.map(d => d.cycling),
        backgroundColor: `${CHART_COLORS.cycling}80`,
        borderColor: CHART_COLORS.cycling,
        fill: true,
      },
      {
        label: 'stretching',
        data: percentageData.map(d => d.stretching),
        backgroundColor: `${CHART_COLORS.stretching}80`,
        borderColor: CHART_COLORS.stretching,
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
