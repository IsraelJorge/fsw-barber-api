import { z } from 'zod'

import { CONSTANTS } from '../utils/constants'

export const PaginationSchema = z.object({
  page: z.coerce.number().default(CONSTANTS.DEFAULT_PAGE),
  limit: z.coerce.number().default(CONSTANTS.DEFAULT_LIMIT),
})

const MetaSchema = PaginationSchema.extend({
  total: z.number(),
  totalPages: z.number(),
})

export const PaginationResponseSchema = z.object({
  meta: MetaSchema,
})
