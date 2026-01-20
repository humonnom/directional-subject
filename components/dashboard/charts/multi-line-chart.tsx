'use client'

import { Line } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import '@/lib/chart-setup'

interface MultiLineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  dualYAxis?: boolean
  leftAxisLabel?: string
  rightAxisLabel?: string
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
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
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
