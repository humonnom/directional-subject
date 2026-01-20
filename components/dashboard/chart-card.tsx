'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function ChartCard({ title, children, isLoading, error, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            데이터를 불러올 수 없습니다.
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
