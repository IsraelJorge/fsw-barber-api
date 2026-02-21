import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { schemas } from '@/db/schemas'
import { ENV } from '@/shared/utils/env'

export const sql = postgres(ENV.DB_URL)

export const db = drizzle(sql, {
  schema: schemas,
  casing: 'snake_case',
})
