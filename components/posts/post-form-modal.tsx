'use client'

import React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { createPost, updatePost } from '@/lib/api'
import {
  type Post,
  type PostCategory,
  type CreatePostInput,
  FORBIDDEN_WORDS,
  containsForbiddenWord,
  checkForbiddenWords,
} from '@/lib/types'

interface PostFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: Post | null
  onSuccess: () => void
}

const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'FREE', label: '자유' },
  { value: 'QNA', label: '질문답변' },
  { value: 'NOTICE', label: '공지' },
]

export function PostFormModal({ open, onOpenChange, post, onSuccess }: PostFormModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<PostCategory>('FREE')
  const [isLoading, setIsLoading] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [bodyError, setBodyError] = useState<string | null>(null)

  const isEditing = !!post

  useEffect(() => {
    if (open) {
      if (post) {
        setTitle(post.title)
        setBody(post.body)
        setCategory(post.category)
      } else {
        setTitle('')
        setBody('')
        setCategory('FREE')
      }
      setTitleError(null)
      setBodyError(null)
    }
  }, [open, post])

  const validateTitle = useCallback((value: string) => {
    const forbidden = containsForbiddenWord(value)
    setTitleError(forbidden ? `금칙어 "${forbidden}"이(가) 포함되어 있습니다.` : null)
    return !forbidden
  }, [])

  const validateBody = useCallback((value: string) => {
    const forbidden = containsForbiddenWord(value)
    setBodyError(forbidden ? `금칙어 "${forbidden}"이(가) 포함되어 있습니다.` : null)
    return !forbidden
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    validateTitle(value)
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setBody(value)
    validateBody(value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setBody(value)
    validateBody(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !body.trim()) {
      toast.error('제목과 본문을 입력해주세요.')
      return
    }

    const forbiddenWord = checkForbiddenWords(title, body)
    if (forbiddenWord) {
      toast.error(`금칙어 "${forbiddenWord}"이(가) 포함되어 있습니다.`)
      return
    }

    setIsLoading(true)

    try {
      const input: CreatePostInput = {
        title: title.trim(),
        body: body.trim(),
        category,
        tags: [],
      }

      if (isEditing && post) {
        await updatePost(post.id, input)
        toast.success('게시글이 수정되었습니다.')
      } else {
        await createPost(input)
        toast.success('게시글이 작성되었습니다.')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Post save error:', error)
      toast.error(isEditing ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? '게시글 수정' : '게시글 작성'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
              aria-invalid={!!titleError}
            />
            {titleError && <p className="text-destructive text-sm">{titleError}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              카테고리
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as PostCategory)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              본문 <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="본문을 입력하세요"
              value={body}
              onChange={handleBodyChange}
              disabled={isLoading}
              rows={10}
              className="resize-none"
              aria-invalid={!!bodyError}
            />
            {bodyError && <p className="text-destructive text-sm">{bodyError}</p>}
          </div>
          <p className="text-muted-foreground text-xs">
            다음 단어는 사용할 수 없습니다: {FORBIDDEN_WORDS.join(', ')}
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading || !!titleError || !!bodyError}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
