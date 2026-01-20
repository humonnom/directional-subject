'use client'

import useSWR from 'swr'
import { getWeeklyMoodTrend } from '@/lib/api'
import { CHART_COLORS } from '@/lib/chart-setup'
import { WeeklyMoodItem } from '@/lib/types'
import { WeeklyTrendChartSection } from './weekly-trend-chart-section'

const MOOD_CATEGORIES = [
  { key: 'happy', label: 'Happy', color: CHART_COLORS.happy },
  { key: 'stressed', label: 'Stressed', color: CHART_COLORS.stressed },
  { key: 'tired', label: 'Tired', color: CHART_COLORS.tired },
]

export function MoodTrendSection() {
  const { data, error, isLoading } = useSWR('weekly-mood-trend', getWeeklyMoodTrend)

  return (
    <WeeklyTrendChartSection<WeeklyMoodItem>
      title="Weekly Mood Trend"
      data={data}
      isLoading={isLoading}
      error={error}
      categories={MOOD_CATEGORIES}
      getWeek={item => item.week}
      getValue={(item, key) => item[key as keyof Omit<WeeklyMoodItem, 'week'>] as number}
    />
  )
}