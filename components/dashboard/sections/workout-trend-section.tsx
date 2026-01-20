'use client'

import useSWR from 'swr'
import { getWeeklyWorkoutTrend } from '@/lib/api'
import { CHART_COLORS } from '@/lib/chart-setup'
import { WeeklyWorkoutItem } from '@/lib/types'
import { WeeklyTrendChartSection } from './weekly-trend-chart-section'

const WORKOUT_CATEGORIES = [
  { key: 'running', label: 'Running', color: CHART_COLORS.running },
  { key: 'cycling', label: 'Cycling', color: CHART_COLORS.cycling },
  { key: 'stretching', label: 'Stretching', color: CHART_COLORS.stretching },
]

export function WorkoutTrendSection() {
  const { data, error, isLoading } = useSWR('weekly-workout-trend', getWeeklyWorkoutTrend)

  return (
    <WeeklyTrendChartSection<WeeklyWorkoutItem>
      title="Weekly Workout Trend"
      data={data}
      isLoading={isLoading}
      error={error}
      categories={WORKOUT_CATEGORIES}
      getWeek={item => item.week}
      getValue={(item, key) => item[key as keyof Omit<WeeklyWorkoutItem, 'week'>] as number}
    />
  )
}