import { z } from 'zod'

import {
  PaginationResponseSchema,
  PaginationSchema,
} from '@/shared/schemas/pagination.schema'

export const RoleEnum = z.enum(['ADMIN', 'USER', 'BARBER'])

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6).optional(),
  avatar: z.string().optional(),
})

export const UpdateUserSchema = CreateUserSchema.partial()

export const UserSchemaResponse = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  avatar: z.string(),
  role: RoleEnum,
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export const UserPaginationResponseSchema = z
  .object({
    data: UserSchemaResponse.array(),
  })
  .extend(PaginationResponseSchema.shape)

export const UserFiltersSchema = PaginationSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UserFilters = z.infer<typeof UserFiltersSchema>
export type UserResponse = z.infer<typeof UserSchemaResponse>
