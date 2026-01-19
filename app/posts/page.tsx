'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { Navbar } from '@/components/layout/navbar'
import { PostTable } from '@/components/posts/post-table'
import { PostFormModal } from '@/components/posts/post-form-modal'
import { DeleteConfirmDialog } from '@/components/posts/delete-confirm-dialog'
import { getPosts, isAuthenticated } from '@/lib/api'
import type { Post, PostCategory, SortField, SortDirection, PostListResponse } from '@/lib/types'

const PAGE_SIZE = 20

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function PostsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PostCategory | 'ALL'>('ALL')
  const [sort, setSort] = useState<SortField>('createdAt')
  const [order, setOrder] = useState<SortDirection>('desc')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    }
  }, [router])

  const getKey = useCallback(
    (pageIndex: number, previousPageData: PostListResponse | null) => {
      // If no more pages
      if (previousPageData && !previousPageData.nextCursor) return null

      return {
        limit: PAGE_SIZE,
        search: debouncedSearch,
        category,
        sort,
        order,
        nextCursor: previousPageData?.nextCursor,
      }
    },
    [debouncedSearch, category, sort, order],
  )

  const { data, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite<PostListResponse>(
    getKey,
    (key) =>
      getPosts({
        limit: key.limit,
        search: key.search,
        category: key.category,
        sort: key.sort,
        order: key.order,
        nextCursor: key.nextCursor,
      }),
  )

  const posts = data ? data.flatMap((page) => page.items) : []
  const hasNextPage = data ? !!data[data.length - 1]?.nextCursor : false
  const isFetchingNextPage = isValidating && data && data.length === size

  const handleFetchNextPage = useCallback(() => {
    setSize(size + 1)
  }, [setSize, size])

  const handleNewPost = useCallback(() => {
    setEditingPost(null)
    setIsFormOpen(true)
  }, [])

  const handleDeletePost = useCallback((id: string) => {
    setDeletePostId(id)
  }, [])

  const handleSortChange = useCallback((newSort: SortField, newOrder: SortDirection) => {
    setSort(newSort)
    setOrder(newOrder)
  }, [])

  const handleFormSuccess = useCallback(() => {
    mutate()
  }, [mutate])

  const handleDeleteSuccess = useCallback(() => {
    mutate()
    setDeletePostId(null)
  }, [mutate])

  return (
    <div className="bg-muted/30 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">게시판</h1>
        <PostTable
          posts={posts}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage ?? false}
          hasNextPage={hasNextPage}
          fetchNextPage={handleFetchNextPage}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
          onNewPost={handleNewPost}
          onDeletePost={handleDeletePost}
        />
      </main>

      <PostFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        post={editingPost}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        open={deletePostId !== null}
        onOpenChange={(open) => !open && setDeletePostId(null)}
        postId={deletePostId}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
