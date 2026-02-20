import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schemas from '@/db/schemas'
import { ENV } from '@/shared/env'

export const sql = postgres(
  `postgresql://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`,
)

export const db = drizzle(sql, {
  schema: schemas,
  casing: 'snake_case',
})
