import { z } from 'zod'

import {
  PaginationResponseSchema,
  PaginationSchema,
} from '@/shared/schemas/pagination.schema'

export const CreateBarberShopSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.url(),
  street: z.string().min(1),
  number: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zipCode: z.string().min(8),
  barberUserId: z.string(),
  phones: z.array(z.string()).min(1),
  hours: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        openTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/, 'Formato inválido. Use HH:MM'),
        closeTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/, 'Formato inválido. Use HH:MM'),
        isClosed: z.boolean().default(false),
      }),
    )
    .min(7)
    .max(7),
})

export const UpdateBarberShopSchema = CreateBarberShopSchema.partial()

export const BarberShopSchemaResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  street: z.string(),
  number: z.string().nullable(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  barberUserId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export const BarberShopPaginationResponseSchema = z
  .object({
    data: BarberShopSchemaResponse.array(),
  })
  .extend(PaginationResponseSchema.shape)

export const BarberShopFiltersSchema = PaginationSchema.extend({
  name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
  barberUserId: z.string().optional(),
})

export type CreateBarberShopInput = z.infer<typeof CreateBarberShopSchema>
export type UpdateBarberShopInput = z.infer<typeof UpdateBarberShopSchema>
export type BarberShopFilters = z.infer<typeof BarberShopFiltersSchema>
export type BarberShopResponse = z.infer<typeof BarberShopSchemaResponse>
