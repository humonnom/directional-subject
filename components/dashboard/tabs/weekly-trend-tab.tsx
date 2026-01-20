'use client'

import useSWR from 'swr'
import { getWeeklyMoodTrend, getWeeklyWorkoutTrend } from '@/lib/api'
import { CHART_COLORS } from '@/lib/chart-setup'
import { WeeklyTrendChartSection } from '../sections/weekly-trend-chart-section'
import { WeeklyMoodItem, WeeklyWorkoutItem } from '@/lib/types'

const MOOD_CATEGORIES = [
  { key: 'happy', label: 'Happy', color: CHART_COLORS.happy },
  { key: 'stressed', label: 'Stressed', color: CHART_COLORS.stressed },
  { key: 'tired', label: 'Tired', color: CHART_COLORS.tired },
]

const WORKOUT_CATEGORIES = [
  { key: 'running', label: 'Running', color: CHART_COLORS.running },
  { key: 'cycling', label: 'Cycling', color: CHART_COLORS.cycling },
  { key: 'stretching', label: 'Stretching', color: CHART_COLORS.stretching },
]

export function WeeklyTrendTab() {
  const moodTrend = useSWR('weekly-mood-trend', getWeeklyMoodTrend)
  const workoutTrend = useSWR('weekly-workout-trend', getWeeklyWorkoutTrend)

  return (
    <div className="space-y-8">
      <WeeklyTrendChartSection<WeeklyMoodItem>
        title="Weekly Mood Trend"
        data={moodTrend.data}
        isLoading={moodTrend.isLoading}
        error={moodTrend.error}
        categories={MOOD_CATEGORIES}
        getWeek={item => item.week}
        getValue={(item, key) => item[key as keyof Omit<WeeklyMoodItem, 'week'>] as number}
      />
      <WeeklyTrendChartSection<WeeklyWorkoutItem>
        title="Weekly Workout Trend"
        data={workoutTrend.data}
        isLoading={workoutTrend.isLoading}
        error={workoutTrend.error}
        categories={WORKOUT_CATEGORIES}
        getWeek={item => item.week}
        getValue={(item, key) => item[key as keyof Omit<WeeklyWorkoutItem, 'week'>] as number}
      />
    </div>
  )
}