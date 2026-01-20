'use client'

import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import '@/lib/chart-setup'

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
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
        },
      },
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
            const hoveredLabel = context.dataset.label ?? ''
            const groupName = extractGroupName(hoveredLabel)
            const dataIndex = context.dataIndex
            const datasets = context.chart.data.datasets

            const relatedDatasets = datasets.filter(
              (ds) => extractGroupName(ds.label ?? '') === groupName
            )

            return relatedDatasets.map((ds) => {
              const metricName = (ds.label ?? '').split(' - ')[1] ?? ds.label
              const value = ds.data[dataIndex]
              return `${metricName}: ${value}`
            })
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: !!leftAxisLabel,
          text: leftAxisLabel,
        },
      },
      ...(dualYAxis && {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: !!rightAxisLabel,
            text: rightAxisLabel,
          },
        },
      }),
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options?.plugins,
    },
    scales: {
      ...defaultOptions.scales,
      ...options?.scales,
    },
  }

  return (
    <div className="h-72">
      <Line data={data} options={mergedOptions} />
    </div>
  )
}
