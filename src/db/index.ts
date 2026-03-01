import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { schemas } from '@/db/schemas'
import { ENV } from '@/shared/utils/env'

import { Database } from './database'

export const sql = postgres(ENV.DB_URL)

const drizzleDb = drizzle(sql, {
  schema: schemas,
  casing: 'snake_case',
})

export const db = new Database(drizzleDb)

export type IDatabase = typeof db
