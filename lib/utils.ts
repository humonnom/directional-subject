import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷팅
 * @param dateString - ISO 형식의 날짜 문자열
 * @param format - 'short': 2024. 01. 15, 'long': 2024년 1월 15일 오후 3:30
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short') {
  const date = new Date(dateString)

  if (format === 'long') {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
