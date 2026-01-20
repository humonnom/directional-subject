'use client'

import { useRef, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import type { ChartData, ChartOptions, Chart } from 'chart.js'
import '@/lib/chart-setup'
import { Legend, buildLegendItems, buildIndexedLegendItems, useLegendState } from './chart-legend'

interface BarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  stacked?: boolean
  horizontal?: boolean
}

export function BarChart({ data, options, stacked = false, horizontal = false }: BarChartProps) {
  const chartRef = useRef<Chart<'bar'>>(null)

  const isSingleDatasetWithBarColors =
    data.datasets.length === 1 && Array.isArray(data.datasets[0]?.backgroundColor)

  const initialItems = useMemo(() => {
    if (isSingleDatasetWithBarColors) {
      return buildIndexedLegendItems(data.labels ?? [], data.datasets[0]?.backgroundColor as string[])
    }
    return buildLegendItems(data.datasets)
  }, [data.labels, data.datasets, isSingleDatasetWithBarColors])

  const { items, updateOverride } = useLegendState(initialItems)

  const handleToggleVisibility = (index: number) => {
    const chart = chartRef.current
    if (!chart) return

    if (isSingleDatasetWithBarColors) {
      const meta = chart.getDatasetMeta(0)
      if (meta.data[index]) {
        const element = meta.data[index] as unknown as { hidden: boolean }
        const isHidden = element.hidden ?? false
        element.hidden = !isHidden
        chart.update()
        updateOverride(index, { hidden: !isHidden })
      }
    } else {
      const isVisible = chart.isDatasetVisible(index)
      if (isVisible) chart.hide(index)
      else chart.show(index)
      updateOverride(index, { hidden: !isVisible })
    }
  }

  const handleColorChange = (index: number, color: string) => {
    const chart = chartRef.current
    if (!chart) return

    if (isSingleDatasetWithBarColors) {
      const dataset = chart.data.datasets[0]
      if (dataset && Array.isArray(dataset.backgroundColor)) {
        (dataset.backgroundColor as string[])[index] = color
        chart.update()
      }
    } else {
      const dataset = chart.data.datasets[index]
      if (dataset) {
        dataset.borderColor = color
        dataset.backgroundColor = color
        chart.update()
      }
    }
    updateOverride(index, { color })
  }

  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: { legend: { display: false } },
    scales: {
      x: { stacked, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: { stacked, grid: { color: 'rgba(0, 0, 0, 0.05)' }, beginAtZero: true },
    },
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
        <Bar ref={chartRef} data={data} options={mergedOptions} />
      </div>
      <Legend items={items} onToggleVisibility={handleToggleVisibility} onColorChange={handleColorChange} />
    </div>
  )
}
