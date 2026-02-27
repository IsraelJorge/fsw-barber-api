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

export type PaginationFilter<T = unknown> = T & {
  page: number
  limit: number
}

export type PaginationParams<T = unknown> = {
  filters: T & PaginationFilter
}

export type PaginateParams<T> = {
  data: T[]
  total: number
  options: PaginationFilter
}
