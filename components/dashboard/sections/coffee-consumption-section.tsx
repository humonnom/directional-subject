'use client'

import useSWR from 'swr'
import { getCoffeeConsumption } from '@/lib/api'
import { CHART_COLORS, formatDate } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { MultiLineChart } from '../charts/multi-line-chart'
import type { CoffeeTeam } from '@/lib/types'

export function CoffeeConsumptionSection() {
  const { data, error, isLoading } = useSWR('coffee-consumption', getCoffeeConsumption)

  // Get all unique dates from the first team's data
  const labels = data?.series[0]?.data.map(d => formatDate(d.date)) ?? []

  const datasets = data?.series.flatMap(({ team, data: teamData }) => {
    const teamColor = CHART_COLORS[team as CoffeeTeam] ?? '#6b7280'
    
    return [
      {
        label: `${team} - Bugs`,
        data: teamData.map(d => d.bugs),
        borderColor: teamColor,
        backgroundColor: teamColor,
        yAxisID: 'y',
        borderDash: [],
        pointStyle: 'circle' as const,
      },
      {
        label: `${team} - Productivity`,
        data: teamData.map(d => d.productivity),
        borderColor: teamColor,
        backgroundColor: teamColor,
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
      <h2 className="text-xl font-semibold">Coffee Consumption Impact</h2>
      <ChartCard 
        title="Bugs vs Productivity by Team" 
        isLoading={isLoading} 
        error={error?.message}
        className="col-span-full"
      >
        <MultiLineChart
          data={chartData}
          dualYAxis
          leftAxisLabel="Bugs"
          rightAxisLabel="Productivity"
        />
      </ChartCard>
    </section>
  )
}
