import { CONSTANTS } from '../utils/constants'
import type { PaginateParams, Pagination } from './types'

export function paginate<T>({
  data,
  total,
  options: { page = CONSTANTS.DEFAULT_PAGE, limit = CONSTANTS.DEFAULT_LIMIT },
}: PaginateParams<T>): Pagination<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
