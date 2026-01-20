'use client'

import { useState, useMemo } from 'react'
import type { ChartDataset } from 'chart.js'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7',
]

// ============================================================
// Types
// ============================================================

export interface LegendItem {
  label: string
  color: string
  hidden: boolean
  index: number
  borderDash?: number[]
}

// ============================================================
// Legend Component (unified)
// ============================================================

interface LegendProps {
  items: LegendItem[]
  onToggleVisibility: (index: number) => void
  onColorChange: (index: number, color: string) => void
  shape?: 'square' | 'circle'
}

export function Legend({
  items,
  onToggleVisibility,
  onColorChange,
  shape = 'square',
}: LegendProps) {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4">
      {items.map((item) => (
        <div key={item.index} className="flex items-center gap-1.5">
          <Popover
            open={openPopoverIndex === item.index}
            onOpenChange={(open) => setOpenPopoverIndex(open ? item.index : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-300 transition-transform hover:scale-110',
                  shape === 'circle' ? 'rounded-full' : 'rounded'
                )}
                style={{ backgroundColor: item.color }}
                title="Click to change color"
              >
                {item.borderDash && item.borderDash.length > 0 && (
                  <span className="h-0.5 w-2.5 bg-white opacity-60" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="grid grid-cols-6 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'h-6 w-6 rounded border-2 transition-transform hover:scale-110',
                      item.color === color ? 'border-gray-800' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(item.index, color)
                      setOpenPopoverIndex(null)
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label htmlFor={`color-${item.index}`} className="text-xs text-gray-600">
                  Custom:
                </label>
                <input
                  id={`color-${item.index}`}
                  type="color"
                  value={item.color}
                  onChange={(e) => onColorChange(item.index, e.target.value)}
                  className="h-6 w-10 cursor-pointer rounded border-0 p-0"
                />
              </div>
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onClick={() => onToggleVisibility(item.index)}
            className={cn(
              'cursor-pointer text-sm transition-opacity',
              item.hidden ? 'text-gray-400 line-through opacity-60' : 'text-gray-700'
            )}
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Hook for legend state management
// ============================================================

export function useLegendState(initialItems: LegendItem[]) {
  const [overrides, setOverrides] = useState<Record<number, Partial<LegendItem>>>({})

  const items = useMemo(
    () => initialItems.map((item) => ({ ...item, ...overrides[item.index] })),
    [initialItems, overrides]
  )

  const updateOverride = (index: number, updates: Partial<LegendItem>) => {
    setOverrides((prev) => ({
      ...prev,
      [index]: { ...prev[index], ...updates },
    }))
  }

  return { items, updateOverride }
}

// ============================================================
// Utility functions
// ============================================================

export function buildLegendItems<T extends 'line' | 'bar' | 'doughnut'>(
  datasets: ChartDataset<T>[]
): LegendItem[] {
  return datasets.map((dataset, index) => ({
    label: dataset.label ?? `Dataset ${index + 1}`,
    color: (Array.isArray(dataset.borderColor)
      ? dataset.borderColor[0]
      : dataset.borderColor ?? dataset.backgroundColor) as string,
    hidden: dataset.hidden ?? false,
    index,
    borderDash: (dataset as ChartDataset<'line'>).borderDash as number[] | undefined,
  }))
}

export function buildIndexedLegendItems(
  labels: unknown[],
  colors: string[] | undefined
): LegendItem[] {
  return labels.map((label, index) => ({
    label: String(label),
    color: colors?.[index] ?? PRESET_COLORS[index % PRESET_COLORS.length],
    hidden: false,
    index,
  }))
}
