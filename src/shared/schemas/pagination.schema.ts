import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
})

const MetaSchema = PaginationSchema.extend({
  total: z.number(),
  totalPages: z.number(),
})

export const PaginationResponseSchema = z.object({
  meta: MetaSchema,
})
