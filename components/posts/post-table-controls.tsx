'use client'

import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ColumnSettings } from './column-settings'
import type { Table } from '@tanstack/react-table'
import type { Post, PostCategory, SortField, SortDirection } from '@/lib/types'

interface PostTableControlsProps {
  table: Table<Post>
  search: string
  onSearchChange: (value: string) => void
  category: PostCategory | 'ALL'
  onCategoryChange: (value: PostCategory | 'ALL') => void
  sort: SortField
  order: SortDirection
  onSortChange: (sort: SortField, order: SortDirection) => void
  onNewPost: () => void
}

const CATEGORIES = [
  { value: 'ALL', label: '전체' },
  { value: 'FREE', label: '자유' },
  { value: 'QNA', label: '질문답변' },
  { value: 'NOTICE', label: '공지' },
] as const

type SortOption = `${SortField}_${SortDirection}`

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'title_asc', label: '제목 오름차순' },
  { value: 'title_desc', label: '제목 내림차순' },
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
]

export function PostTableControls({
  table,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  order,
  onSortChange,
  onNewPost,
}: PostTableControlsProps) {
  const currentSortValue: SortOption = `${sort}_${order}`

  const handleSortChange = (value: string) => {
    const [newSort, newOrder] = value.split('_') as [SortField, SortDirection]
    onSortChange(newSort, newOrder)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button onClick={onNewPost} className="gap-2">
          <Plus className="size-4" />새 게시글 작성
        </Button>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="제목 또는 본문 검색"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <ColumnSettings table={table} />
      </div>
    </div>
  )
}
