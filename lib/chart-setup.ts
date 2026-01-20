'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
)

export const CHART_COLORS = {
  // Mood colors
  happy: '#22c55e',
  stressed: '#f59e0b',
  tired: '#ef4444',

  // Workout colors
  running: '#3b82f6',
  cycling: '#f97316',
  stretching: '#a855f7',

  // Department colors
  HR: '#3b82f6',
  Sales: '#10b981',
  Marketing: '#f59e0b',
}

export const BRAND_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
]

export function convertToPercentage(data: number[]): number[] {
  const total = data.reduce((sum, val) => sum + val, 0)
  if (total === 0) return data.map(() => 0)
  return data.map((val) => (val / total) * 100)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
