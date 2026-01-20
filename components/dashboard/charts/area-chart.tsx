'use client'

import { useRef, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, Chart } from 'chart.js'
import '@/lib/chart-setup'
import { Legend, buildLegendItems, useLegendState } from './chart-legend'

interface AreaChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  stacked?: boolean
}

export function AreaChart({ data, options, stacked = false }: AreaChartProps) {
  const chartRef = useRef<Chart<'line'>>(null)
  const initialItems = useMemo(() => buildLegendItems(data.datasets), [data.datasets])
  const { items, updateOverride } = useLegendState(initialItems)

  const handleToggleVisibility = (index: number) => {
    const chart = chartRef.current
    if (!chart) return

    const isVisible = chart.isDatasetVisible(index)
    if (isVisible) chart.hide(index)
    else chart.show(index)
    updateOverride(index, { hidden: !isVisible })
  }

  const handleColorChange = (index: number, color: string) => {
    const chart = chartRef.current
    if (!chart) return

    const dataset = chart.data.datasets[index]
    if (dataset) {
      dataset.borderColor = color
      dataset.backgroundColor = color + '33'
      chart.update()
    }
    updateOverride(index, { color })
  }

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: { stacked, grid: { color: 'rgba(0, 0, 0, 0.05)' }, beginAtZero: true },
    },
    elements: { line: { tension: 0.4 } },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: { ...defaultOptions.plugins, ...options?.plugins },
    scales: { ...defaultOptions.scales, ...options?.scales },
  }

  return (
    <div>
      <div className="h-56">
        <Line ref={chartRef} data={data} options={mergedOptions} />
      </div>
      <Legend items={items} onToggleVisibility={handleToggleVisibility} onColorChange={handleColorChange} />
    </div>
  )
}
