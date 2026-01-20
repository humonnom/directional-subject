'use client'

import { BRAND_COLORS } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { MultiLineChart } from '../charts/multi-line-chart'
import type { CoffeeConsumptionResponse } from '@/lib/types'

interface CoffeeConsumptionSectionProps {
  data: CoffeeConsumptionResponse | undefined
  isLoading: boolean
  error: Error | undefined
}

export function CoffeeConsumptionSection({
  data,
  isLoading,
  error,
}: CoffeeConsumptionSectionProps) {
  const xAxis = data?.teams[0].series.map((s) => `${s.cups}`) ?? []

  const datasets =
    data?.teams.flatMap(({ team, series: teamData }, index) => {
      const teamColor = BRAND_COLORS[index % BRAND_COLORS.length]

      return [
        {
          label: `${team} - Bugs`,
          data: teamData.map((d) => d.bugs),
          borderColor: teamColor,
          backgroundColor: teamColor,
          yAxisID: 'y',
          borderDash: [],
          pointStyle: 'circle' as const,
        },
        {
          label: `${team} - Productivity`,
          data: teamData.map((d) => d.productivity),
          borderColor: teamColor,
          backgroundColor: teamColor,
          yAxisID: 'y1',
          borderDash: [5, 5],
          pointStyle: 'rect' as const,
        },
      ]
    }) ?? []

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
          data={{ labels: xAxis, datasets }}
          dualYAxis
          leftAxisLabel="Bugs"
          rightAxisLabel="Productivity"
        />
      </ChartCard>
    </section>
  )
}
