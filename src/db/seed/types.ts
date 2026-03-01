import { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import { getGeneratorsFunctions } from 'drizzle-seed'

import { schemas } from '@/db/schemas'

type SCHEMA = typeof schemas

export type TSeedFuncs = ReturnType<typeof getGeneratorsFunctions>

export type TSeedHelper<T extends keyof SCHEMA> = (
  f: TSeedFuncs,
) => SCHEMA[T] extends PgTable
  ? {
      count?: number
      columns?: {
        [column in keyof SCHEMA[T] as SCHEMA[T][column] extends PgColumn
          ? column
          : never]?: unknown
      }
      with?: unknown
    }
  : never
