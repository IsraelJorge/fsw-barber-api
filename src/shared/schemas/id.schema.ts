import { z } from 'zod'

export const IdSchema = z.object({ id: z.uuid() })

export type IdInput = z.infer<typeof IdSchema>
