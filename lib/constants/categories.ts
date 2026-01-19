import type { PostCategory } from '@/lib/types'

export const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'FREE', label: '자유' },
  { value: 'QNA', label: '질문답변' },
  { value: 'NOTICE', label: '공지' },
]

export const CATEGORIES_WITH_ALL: { value: PostCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  ...CATEGORIES,
]
