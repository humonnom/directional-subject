'use client'

import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type VisibilityState,
  type ColumnResizeMode,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { CategoryBadge } from './category-badge'
import { PostTableControls } from './post-table-controls'
import type { Post, PostCategory, SortField, SortDirection } from '@/lib/types'

interface PostTableProps {
  posts: Post[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  search: string
  onSearchChange: (value: string) => void
  category: PostCategory | 'ALL'
  onCategoryChange: (value: PostCategory | 'ALL') => void
  sort: SortField
  order: SortDirection
  onSortChange: (sort: SortField, order: SortDirection) => void
  onNewPost: () => void
  onDeletePost: (id: string) => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function PostTable({
  posts,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  order,
  onSortChange,
  onNewPost,
  onDeletePost,
}: PostTableProps) {
  const router = useRouter()
  const observerRef = useRef<HTMLDivElement>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange')

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 240,
        minSize: 200,
        maxSize: 300,
        cell: ({ row }) => (
          <span className="font-mono text-xs truncate block">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'title',
        header: '제목',
        size: 280,
        minSize: 150,
        maxSize: 500,
        cell: ({ row }) => (
          <span className="truncate block">{row.original.title}</span>
        ),
      },
      {
        accessorKey: 'category',
        header: '카테고리',
        size: 100,
        minSize: 80,
        maxSize: 150,
        cell: ({ row }) => <CategoryBadge category={row.original.category} />,
      },
      {
        accessorKey: 'createdAt',
        header: '작성일',
        size: 110,
        minSize: 100,
        maxSize: 150,
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '액션',
        size: 70,
        minSize: 60,
        maxSize: 100,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              onDeletePost(row.original.id)
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">삭제</span>
          </Button>
        ),
      },
    ],
    [onDeletePost],
  )

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  const handleRowClick = useCallback(
    (postId: string) => {
      router.push(`/posts/${postId}`)
    },
    [router],
  )

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex flex-col gap-4">
      <PostTableControls
        table={table}
        search={search}
        onSearchChange={onSearchChange}
        category={category}
        onCategoryChange={onCategoryChange}
        sort={sort}
        order={order}
        onSortChange={onSortChange}
        onNewPost={onNewPost}
      />

      <div className="rounded-lg border" style={{ width: 'fit-content', maxWidth: '100%', overflowX: 'auto' }}>
        <Table className="w-auto table-fixed" style={{ width: table.getCenterTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={cn(
                      'relative select-none',
                      index < headerGroup.headers.length - 1 && 'border-r border-border',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          'absolute right-0 top-0 z-20 h-full w-1 cursor-col-resize select-none touch-none',
                          'bg-border hover:bg-primary/50 transition-colors',
                          header.column.getIsResizing() && 'bg-primary',
                        )}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>로딩 중...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original.id)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className={cn(
                        index < row.getVisibleCells().length - 1 && 'border-r border-border',
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="flex h-10 items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-muted-foreground">더 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  )
}
