'use client'

import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  threshold?: number
}

export function useInfiniteScroll({
  hasNextPage,
  isFetching,
  fetchNextPage,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement>(null)
  const fetchNextPageRef = useRef(fetchNextPage)

  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage
  }, [fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPageRef.current()
        }
      },
      { threshold },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetching, threshold])

  return { observerRef }
}
