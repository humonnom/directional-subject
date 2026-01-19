import { cn } from '@/lib/utils'
import type { PostCategory } from '@/lib/types'

interface CategoryBadgeProps {
  category: PostCategory
  className?: string
}

const categoryConfig: Record<PostCategory, { label: string; className: string }> = {
  FREE: {
    label: '자유',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  QNA: {
    label: '질문답변',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  NOTICE: {
    label: '공지',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = categoryConfig[category]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
