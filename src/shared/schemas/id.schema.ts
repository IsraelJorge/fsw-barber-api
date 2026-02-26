import { z } from 'zod'

export const IdSchema = z.object({ id: z.string() })

export type IdInput = z.infer<typeof IdSchema>
