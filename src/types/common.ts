export interface PagingResponse<T> {
  data: T[]
  cursor?: string
  hasMore: boolean
}

export interface Response<T> {
  data: T
  code: number
  message: string
  status: number
}
export interface HttpErrorResponse {
  code: number
  message?: string
}
