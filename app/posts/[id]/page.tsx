'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { CategoryBadge } from '@/components/posts/category-badge'
import { PostFormModal } from '@/components/posts/post-form-modal'
import { DeleteConfirmDialog } from '@/components/posts/delete-confirm-dialog'
import { getPost, isAuthenticated } from '@/lib/api'
import type { Post } from '@/lib/types'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PostDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    }
  }, [router])

  const {
    data: post,
    error,
    isLoading,
    mutate,
  } = useSWR<Post>(id ? ['post', id] : null, () => getPost(id))

  const handleBack = useCallback(() => {
    router.push('/posts')
  }, [router])

  const handleEdit = useCallback(() => {
    setIsFormOpen(true)
  }, [])

  const handleDelete = useCallback(() => {
    setIsDeleteOpen(true)
  }, [])

  const handleFormSuccess = useCallback(() => {
    mutate()
  }, [mutate])

  const handleDeleteSuccess = useCallback(() => {
    router.push('/posts')
  }, [router])

  if (!id) {
    return (
      <div className="bg-muted/30 min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-muted-foreground text-center">잘못된 게시글 ID입니다.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Button variant="ghost" onClick={handleBack} className="text-muted-foreground mb-4 gap-2">
          <ArrowLeft className="size-4" />
          목록으로
        </Button>

        {isLoading ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <Spinner className="size-6" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">게시글을 불러오는데 실패했습니다.</p>
            </CardContent>
          </Card>
        ) : post ? (
          <>
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <CategoryBadge category={post.category} />
                  <span className="text-muted-foreground text-sm">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <Separator className="my-6" />
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleEdit} className="gap-2 bg-transparent">
                <Pencil className="size-4" />
                수정
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="gap-2">
                <Trash2 className="size-4" />
                삭제
              </Button>
            </div>

            <PostFormModal
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              post={post}
              onSuccess={handleFormSuccess}
            />

            <DeleteConfirmDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              postId={post.id}
              onSuccess={handleDeleteSuccess}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
