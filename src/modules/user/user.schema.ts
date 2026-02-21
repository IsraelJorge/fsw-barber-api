import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6).optional(),
  avatar: z.url().optional(),
  role: z.enum(['USER', 'ADMIN', 'BARBER']).optional(),
})

export const UpdateUserSchema = CreateUserSchema.partial()

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
