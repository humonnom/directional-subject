// Post types
export type PostCategory = 'FREE' | 'QNA' | 'NOTICE'
export type SortField = 'createdAt' | 'title'
export type SortDirection = 'asc' | 'desc'

export interface Post {
  id: string
  userId: string
  title: string
  body: string
  category: PostCategory
  tags: string[]
  createdAt: string
}

export interface PostListResponse {
  items: Post[]
  nextCursor?: string
  prevCursor?: string
}

export interface CreatePostInput {
  title: string
  body: string
  category: PostCategory
  tags: string[]
}

export interface UpdatePostInput {
  title?: string
  body?: string
  category?: PostCategory
  tags?: string[]
}

// Auth types
export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user?: {
    id: string
    email: string
  }
}

export interface User {
  id: number
  email: string
}

// Filter types
export interface PostFilters {
  search?: string
  category?: PostCategory | 'ALL'
  sort?: SortField
  order?: SortDirection
  limit?: number
  nextCursor?: string
  prevCursor?: string
  from?: string
  to?: string
}

// Forbidden words
export const FORBIDDEN_WORDS = ['캄보디아', '프놈펜', '불법체류', '텔레그램']

export function containsForbiddenWord(text: string): string | null {
  for (const word of FORBIDDEN_WORDS) {
    if (text.includes(word)) {
      return word
    }
  }
  return null
}

export function checkForbiddenWords(title: string, content: string): string | null {
  const titleCheck = containsForbiddenWord(title)
  if (titleCheck) return titleCheck

  const contentCheck = containsForbiddenWord(content)
  if (contentCheck) return contentCheck

  return null
}

// Mock API Types

// Weekly Mood Trend
export interface WeeklyMoodItem {
  week: string
  happy: number
  neutral: number
  sad: number
}

export type WeeklyMoodTrendResponse = WeeklyMoodItem[]

// Popular Snack Brands
export interface PopularSnackBrandItem {
  name: string
  share: number
}

export type PopularSnackBrandsResponse = PopularSnackBrandItem[];

// Top Coffee Brands
export interface TopCoffeeBrandItem {
  brand: string
  popularity: number
}

export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[]

// Weekly Workout Trend
export interface WeeklyWorkoutItem {
  week: string
  cardio: number
  strength: number
  yoga: number
}

export interface WeeklyWorkoutTrendResponse {
  items: WeeklyWorkoutItem[]
}

// Coffee Consumption
export type CoffeeTeam = 'FE' | 'BE' | 'iOS' | 'Android' | 'Data' | 'QA' | 'Ops'

export interface CoffeeDataPoint {
  date: string
  cups: number
  bugs: number
  productivity: number
}

export interface CoffeeConsumptionResponse {
  series: Array<{
    team: CoffeeTeam
    data: CoffeeDataPoint[]
  }>
}

// Snack Impact
export type SnackImpactDepartment = 'Design' | 'FE' | 'BE' | 'QA' | 'PM' | 'Ops' | 'Data'

export interface SnackImpactDataPoint {
  date: string
  satisfaction: number
  productivity: number
  stress: number
}

export interface SnackImpactResponse {
  series: Array<{
    department: SnackImpactDepartment
    data: SnackImpactDataPoint[]
  }>
}
