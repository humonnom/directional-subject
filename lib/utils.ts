import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, style: 'short' | 'long' = 'short') {
  const date = new Date(dateString)

  if (style === 'long') {
    return format(date, 'PPP p', { locale: ko })
  }

  return format(date, 'yyyy. MM. dd', { locale: ko })
}
