import { z } from 'zod'

import { UserSchemaResponse } from '../user/user.schema'

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const LoginResponseSchema = z.object({
  user: UserSchemaResponse,
  token: z.string(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
