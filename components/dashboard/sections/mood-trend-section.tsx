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
  const happyData = data?.map(item => item.happy) ?? []
  const neutralData = data?.map(item => item.neutral) ?? []
  const sadData = data?.map(item => item.sad) ?? []

  // Total for doughnut
  const totalHappy = happyData.reduce((a, b) => a + b, 0)
  const totalNeutral = neutralData.reduce((a, b) => a + b, 0)
  const totalSad = sadData.reduce((a, b) => a + b, 0)
  const grandTotal = totalHappy + totalNeutral + totalSad

  // Percentage data for stacked charts
  const percentageData = data?.map(item => {
    const total = item.happy + item.neutral + item.sad
    return {
      happy: total ? (item.happy / total) * 100 : 0,
      neutral: total ? (item.neutral / total) * 100 : 0,
      sad: total ? (item.sad / total) * 100 : 0,
    }
  }) ?? []

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Happy',
        data: happyData,
        backgroundColor: CHART_COLORS.happy,
      },
      {
        label: 'Neutral',
        data: neutralData,
        backgroundColor: CHART_COLORS.neutral,
      },
      {
        label: 'Sad',
        data: sadData,
        backgroundColor: CHART_COLORS.sad,
      },
    ],
  }

  const doughnutData = {
    labels: ['Happy', 'Neutral', 'Sad'],
    datasets: [
      {
        data: [totalHappy, totalNeutral, totalSad],
        backgroundColor: [CHART_COLORS.happy, CHART_COLORS.neutral, CHART_COLORS.sad],
        borderWidth: 0,
      },
    ],
  }

  const stackedBarData = {
    labels,
    datasets: [
      {
        label: 'Happy',
        data: percentageData.map(d => d.happy),
        backgroundColor: CHART_COLORS.happy,
      },
      {
        label: 'Neutral',
        data: percentageData.map(d => d.neutral),
        backgroundColor: CHART_COLORS.neutral,
      },
      {
        label: 'Sad',
        data: percentageData.map(d => d.sad),
        backgroundColor: CHART_COLORS.sad,
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
        label: 'Neutral',
        data: percentageData.map(d => d.neutral),
        backgroundColor: `${CHART_COLORS.neutral}80`,
        borderColor: CHART_COLORS.neutral,
        fill: true,
      },
      {
        label: 'Sad',
        data: percentageData.map(d => d.sad),
        backgroundColor: `${CHART_COLORS.sad}80`,
        borderColor: CHART_COLORS.sad,
        fill: true,
      },
    ],
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Weekly Mood Trend</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Bar Chart" isLoading={isLoading} error={error?.message}>
          <BarChart data={barChartData} />
        </ChartCard>
        {/*<ChartCard title="Doughnut Chart" isLoading={isLoading} error={error?.message}>*/}
        {/*  <DoughnutChart data={doughnutData} centerText={grandTotal} />*/}
        {/*</ChartCard>*/}
        {/*<ChartCard title="Stacked Bar Chart (%)" isLoading={isLoading} error={error?.message}>*/}
        {/*  <BarChart data={stackedBarData} stacked />*/}
        {/*</ChartCard>*/}
        {/*<ChartCard title="Stacked Area Chart (%)" isLoading={isLoading} error={error?.message}>*/}
        {/*  <AreaChart data={stackedAreaData} stacked />*/}
        {/*</ChartCard>*/}
      </div>
    </section>
  )
}
