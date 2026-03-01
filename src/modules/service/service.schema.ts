import { z } from 'zod'

import { PaginationSchema } from '@/shared/schemas/pagination.schema'

export const CreateServiceSchema = z.object({
  barberShopId: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.url(),
  priceInCents: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
})

export const UpdateServiceSchema = CreateServiceSchema.partial()

export const ServiceFiltersSchema = PaginationSchema.extend({
  barberShopId: z.string().optional(),
  name: z.string().optional(),
})

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>
export type ServiceFilters = z.infer<typeof ServiceFiltersSchema>
