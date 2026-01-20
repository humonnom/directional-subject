import type {
  Post,
  PostListResponse,
  CreatePostInput,
  UpdatePostInput,
  LoginInput,
  LoginResponse,
  PostFilters,
  WeeklyMoodTrendResponse,
  PopularSnackBrandsResponse,
  TopCoffeeBrandsResponse,
  WeeklyWorkoutTrendResponse,
  CoffeeConsumptionResponse,
  SnackImpactResponse,
} from './types'

const API_BASE_URL = 'https://fe-hiring-rest-api.vercel.app'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('accessToken', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('accessToken')
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorData.message || `HTTP error! status: ${response.status}`,
    )
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Auth API
export async function login(input: LoginInput): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

// Posts API
export async function getPosts(filters: PostFilters = {}): Promise<PostListResponse> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.append('search', filters.search)
  }
  if (filters.category && filters.category !== 'ALL') {
    params.append('category', filters.category)
  }
  if (filters.sort) {
    params.append('sort', filters.sort)
  }
  if (filters.order) {
    params.append('order', filters.order)
  }
  if (filters.limit) {
    params.append('limit', String(filters.limit))
  }
  if (filters.nextCursor) {
    params.append('nextCursor', filters.nextCursor)
  }
  if (filters.prevCursor) {
    params.append('prevCursor', filters.prevCursor)
  }
  if (filters.from) {
    params.append('from', filters.from)
  }
  if (filters.to) {
    params.append('to', filters.to)
  }

  const queryString = params.toString()
  const endpoint = `/posts${queryString ? `?${queryString}` : ''}`

  return fetchApi<PostListResponse>(endpoint)
}

export async function getPost(id: string): Promise<Post> {
  return fetchApi<Post>(`/posts/${id}`)
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  return fetchApi<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  return fetchApi<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deletePost(id: string): Promise<void> {
  return fetchApi<void>(`/posts/${id}`, {
    method: 'DELETE',
  })
}

export async function getWeeklyMoodTrend(): Promise<WeeklyMoodTrendResponse> {
  return fetchApi<WeeklyMoodTrendResponse>('/mock/weekly-mood-trend')
}

export async function getPopularSnackBrands(): Promise<PopularSnackBrandsResponse> {
  return fetchApi<PopularSnackBrandsResponse>('/mock/popular-snack-brands')
}

export async function getTopCoffeeBrands(): Promise<TopCoffeeBrandsResponse> {
  return fetchApi<TopCoffeeBrandsResponse>('/mock/top-coffee-brands')
}

export async function getWeeklyWorkoutTrend(): Promise<WeeklyWorkoutTrendResponse> {
  return fetchApi<WeeklyWorkoutTrendResponse>('/mock/weekly-workout-trend')
}

export async function getCoffeeConsumption(): Promise<CoffeeConsumptionResponse> {
  return fetchApi<CoffeeConsumptionResponse>('/mock/coffee-consumption')
}

export async function getSnackImpact(): Promise<SnackImpactResponse> {
  return fetchApi<SnackImpactResponse>('/mock/snack-impact')
}

export { ApiError }
