import { z } from 'zod'

const EnvSchema = z
  .object({
    PORT: z.coerce.number().default(3333),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  })
  .transform((env) => {
    return {
      ...env,
      DB_URL: `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
    }
  })

export const ENV = EnvSchema.parse(process.env)
