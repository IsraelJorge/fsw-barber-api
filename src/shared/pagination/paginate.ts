/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  sql,
  Table,
} from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { CONSTANTS } from '../utils/constants'
import type { Pagination, PaginationFilter } from './types'

type PaginateParams<T> = {
  data: T[]
  total: number
  options: PaginationFilter
}

export function paginate<T>({
  data,
  total,
  options: { page = CONSTANTS.DEFAULT_PAGE, limit = CONSTANTS.DEFAULT_LIMIT },
}: PaginateParams<T>): Pagination<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export interface WithPaginationParams<
  TSchema extends Record<string, unknown>,
  TTableName extends keyof ExtractTablesWithRelations<TSchema>,
  TQueryConfig extends DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<TSchema>,
    ExtractTablesWithRelations<TSchema>[TTableName]
  >,
> {
  db: PostgresJsDatabase<TSchema>
  table: Table
  query: TTableName
  queryConfig?: TQueryConfig
  pagination: PaginationFilter
}

export async function withPagination<
  TSchema extends Record<string, unknown>,
  TTableName extends keyof ExtractTablesWithRelations<TSchema>,
  TQueryConfig extends DBQueryConfig<
    'many',
    true,
    ExtractTablesWithRelations<TSchema>,
    ExtractTablesWithRelations<TSchema>[TTableName]
  >,
>({
  db,
  table,
  query,
  queryConfig,
  pagination: { page, limit },
}: WithPaginationParams<TSchema, TTableName, TQueryConfig>): Promise<
  Pagination<
    BuildQueryResult<
      ExtractTablesWithRelations<TSchema>,
      ExtractTablesWithRelations<TSchema>[TTableName],
      TQueryConfig
    >
  >
> {
  const countQuery = db
    .select({ total: sql<number>`count(*)` })
    .from(table as any)
    .$dynamic()

  const where = queryConfig?.where
  const [{ total }] = where
    ? await countQuery.where(where as any)
    : await countQuery

  const offset = (page - 1) * limit

  const dbQuery = (db.query as any)[query]
  if (!dbQuery || !dbQuery.findMany) {
    throw new Error(`Table ${String(query)} not found in db.query`)
  }

  const data = await dbQuery.findMany({
    ...queryConfig,
    limit,
    offset,
  })

  return paginate({
    data: data as any,
    total: Number(total),
    options: { page, limit },
  })
}
