'use client'

import { useState, useEffect, useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import { getPosts } from '@/lib/api'
import type { PostCategory, SortField, SortDirection, PostListResponse } from '@/lib/types'

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

interface UsePostListOptions {
  search: string
  category: PostCategory | 'ALL'
  sort: SortField
  order: SortDirection
}

export function usePostList({ search, category, sort, order }: UsePostListOptions) {
  const debouncedSearch = useDebounce(search, 300)

  const getKey = useCallback(
    (pageIndex: number, previousPageData: PostListResponse | null) => {
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

  const fetchNextPage = useCallback(() => {
    setSize((prev) => prev + 1)
  }, [setSize])

  return {
    posts,
    isLoading,
    isFetchingNextPage: isFetchingNextPage ?? false,
    hasNextPage,
    fetchNextPage,
    mutate,
  }
}
