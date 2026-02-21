type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Pagination<T> = {
  data: T[]
  meta: PaginationMeta
}

export type PaginationOptions = {
  page: number
  limit: number
}

export type PaginationParams<T = unknown> = {
  filters: T & PaginationOptions
}
