'use client'

import { CHART_COLORS } from '@/lib/chart-setup'
import { ChartCard } from '../chart-card'
import { MultiLineChart } from '../charts/multi-line-chart'
import type { SnackImpactResponse } from '@/lib/types'

interface SnackImpactSectionProps {
  data: SnackImpactResponse | undefined
  isLoading: boolean
  error: Error | undefined
}

export function SnackImpactSection({ data, isLoading, error }: SnackImpactSectionProps) {
  const xAxis = data?.departments[0]?.metrics.map((m) => `${m.snacks}`) ?? []

  const datasets =
    data?.departments.flatMap(({ name, metrics }) => {
      const deptColor = CHART_COLORS[name] ?? '#6b7280'

      return [
        {
          label: `${name} - Meetings Missed`,
          data: metrics.map((m) => m.meetingsMissed),
          borderColor: deptColor,
          backgroundColor: deptColor,
          yAxisID: 'y',
          borderDash: [],
          pointStyle: 'circle' as const,
        },
        {
          label: `${name} - Morale Score`,
          data: metrics.map((m) => m.morale),
          borderColor: deptColor,
          backgroundColor: deptColor,
          yAxisID: 'y1',
          borderDash: [5, 5],
          pointStyle: 'rect' as const,
        },
      ]
    }) ?? []

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Snack Impact</h2>
      <ChartCard
        title="Meetings Missed vs Morale Score"
        isLoading={isLoading}
        error={error?.message}
        className="col-span-full"
      >
        <MultiLineChart
          data={{ labels: xAxis, datasets }}
          dualYAxis
          leftAxisLabel="Meetings Missed"
          rightAxisLabel="Morale Score"
        />
      </ChartCard>
    </section>
  )
}
