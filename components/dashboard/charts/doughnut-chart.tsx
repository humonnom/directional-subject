'use client'

import { useRef, useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions, Chart } from 'chart.js'
import '@/lib/chart-setup'
import { Legend, buildIndexedLegendItems, useLegendState } from './chart-legend'

interface DoughnutChartProps {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
}

export function DoughnutChart({ data, options }: DoughnutChartProps) {
  const chartRef = useRef<Chart<'doughnut'>>(null)

  const initialItems = useMemo(
    () => buildIndexedLegendItems(data.labels ?? [], data.datasets[0]?.backgroundColor as string[]),
    [data.labels, data.datasets]
  )

  const { items, updateOverride } = useLegendState(initialItems)

  const handleToggleVisibility = (index: number) => {
    const chart = chartRef.current
    if (!chart) return

    const meta = chart.getDatasetMeta(0)
    if (meta.data[index]) {
      const element = meta.data[index] as unknown as { hidden: boolean }
      const isHidden = element.hidden ?? false
      element.hidden = !isHidden
      chart.update()
      updateOverride(index, { hidden: !isHidden })
    }
  }

  const handleColorChange = (index: number, color: string) => {
    const chart = chartRef.current
    if (!chart) return

    const dataset = chart.data.datasets[0]
    if (dataset && Array.isArray(dataset.backgroundColor)) {
      (dataset.backgroundColor as string[])[index] = color
      chart.update()
    }
    updateOverride(index, { color })
  }

  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { display: false } },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: { ...defaultOptions.plugins, ...options?.plugins },
  }

  return (
    <div>
      <div className="h-56">
        <Doughnut ref={chartRef} data={data} options={mergedOptions} />
      </div>
      <Legend
        items={items}
        onToggleVisibility={handleToggleVisibility}
        onColorChange={handleColorChange}
        shape="circle"
      />
    </div>
  )
}
