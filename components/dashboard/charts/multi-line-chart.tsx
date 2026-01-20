'use client'

import { useRef, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, TooltipItem, Chart } from 'chart.js'
import '@/lib/chart-setup'
import { Legend, buildLegendItems, type LegendItem } from './chart-legend'

interface MultiLineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  dualYAxis?: boolean
  leftAxisLabel?: string
  rightAxisLabel?: string
}

function extractGroupName(label: string): string {
  const parts = label.split(' - ')
  return parts.length > 1 ? parts[0] : label
}

export function MultiLineChart({
  data,
  options,
  dualYAxis = false,
  leftAxisLabel = '',
  rightAxisLabel = '',
}: MultiLineChartProps) {
  const chartRef = useRef<Chart<'line'>>(null)
  const initialItems = useMemo(() => buildLegendItems(data.datasets), [data.datasets])
  const [overrides, setOverrides] = useState<Record<number, Partial<LegendItem>>>({})

  const items = useMemo(
    () => initialItems.map((item) => ({ ...item, ...overrides[item.index] })),
    [initialItems, overrides]
  )

  const handleToggleVisibility = (index: number) => {
    const chart = chartRef.current
    if (!chart) return

    const isVisible = chart.isDatasetVisible(index)
    if (isVisible) chart.hide(index)
    else chart.show(index)

    setOverrides((prev) => ({ ...prev, [index]: { ...prev[index], hidden: !isVisible } }))
  }

  const handleColorChange = (index: number, color: string) => {
    const chart = chartRef.current
    if (!chart) return

    const clickedDataset = chart.data.datasets[index]
    if (!clickedDataset) return

    // Update all datasets in the same group (same team)
    const groupName = extractGroupName(clickedDataset.label ?? '')
    const relatedIndices: number[] = []

    chart.data.datasets.forEach((ds, idx) => {
      if (extractGroupName(ds.label ?? '') === groupName) {
        ds.borderColor = color
        ds.backgroundColor = color
        relatedIndices.push(idx)
      }
    })
    chart.update()

    setOverrides((prev) => {
      const next = { ...prev }
      relatedIndices.forEach((idx) => {
        next[idx] = { ...next[idx], color }
      })
      return next
    })
  }

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: true },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            if (tooltipItems.length === 0) return ''
            const item = tooltipItems[0]
            const label = item.chart.data.labels?.[item.dataIndex]
            const groupName = extractGroupName(item.dataset.label ?? '')
            return `${groupName} - ${leftAxisLabel || 'X'}: ${label}`
          },
          label: (context: TooltipItem<'line'>) => {
            const groupName = extractGroupName(context.dataset.label ?? '')
            const datasets = context.chart.data.datasets.filter(
              (ds) => extractGroupName(ds.label ?? '') === groupName
            )
            return datasets.map((ds) => {
              const metric = (ds.label ?? '').split(' - ')[1] ?? ds.label
              return `${metric}: ${ds.data[context.dataIndex]}`
            })
          },
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        title: { display: !!leftAxisLabel, text: leftAxisLabel },
      },
      ...(dualYAxis && {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: { drawOnChartArea: false },
          title: { display: !!rightAxisLabel, text: rightAxisLabel },
        },
      }),
    },
    elements: { line: { tension: 0.3 } },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: { ...defaultOptions.plugins, ...options?.plugins },
    scales: { ...defaultOptions.scales, ...options?.scales },
  }

  return (
    <div>
      <div className="h-64">
        <Line ref={chartRef} data={data} options={mergedOptions} />
      </div>
      <Legend items={items} onToggleVisibility={handleToggleVisibility} onColorChange={handleColorChange} />
    </div>
  )
}
