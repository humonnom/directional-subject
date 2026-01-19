'use client'

import { useState, useCallback } from 'react'
import { containsForbiddenWord } from '@/lib/types'

export function useForbiddenWordValidation() {
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback((value: string) => {
    const forbidden = containsForbiddenWord(value)
    setError(forbidden ? `금칙어 "${forbidden}"이(가) 포함되어 있습니다.` : null)
    return !forbidden
  }, [])

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { error, validate, reset }
}
