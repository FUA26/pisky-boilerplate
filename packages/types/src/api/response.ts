export interface ApiResponse<T = unknown> {
  data: T
  message?: string
}

export interface ApiErrorResponse {
  error: string
  message?: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
