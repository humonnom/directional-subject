'use client'

import { useState, useCallback } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { PostTable } from '@/components/posts/post-table'
import { PostFormModal } from '@/components/posts/post-form-modal'
import { DeleteConfirmDialog } from '@/components/posts/delete-confirm-dialog'
import { useAuthGuard } from '@/lib/hooks/use-auth-guard'
import { usePostList } from '@/lib/hooks/use-post-list'
import type { Post, PostCategory, SortField, SortDirection } from '@/lib/types'

export default function PostsPage() {
  useAuthGuard()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PostCategory | 'ALL'>('ALL')
  const [sort, setSort] = useState<SortField>('createdAt')
  const [order, setOrder] = useState<SortDirection>('desc')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)

  const { posts, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, mutate } = usePostList({
    search,
    category,
    sort,
    order,
  })

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
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
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
