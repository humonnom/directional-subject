'use client'

import { Bar } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import '@/lib/chart-setup'

interface BarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  stacked?: boolean
  horizontal?: boolean
}

export function BarChart({ data, options, stacked = false, horizontal = false }: BarChartProps) {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
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
        stacked,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        stacked,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        beginAtZero: true,
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
    <div className="h-64">
      <Bar data={data} options={mergedOptions} />
    </div>
  )
}
