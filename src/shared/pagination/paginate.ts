/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferSelectModel, SQL, sql, Table } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import type { Pagination, PaginationFilter } from './types'

type PaginateParams<T> = {
  data: T[]
  total: number
  options: PaginationFilter
}

export function paginate<T>({
  data,
  total,
  options,
}: PaginateParams<T>): Pagination<T> {
  return {
    data,
    meta: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
  }
}

export interface WithPaginationParams<
  TSchema extends Record<string, unknown> = any,
  TTable extends Table = Table,
  TColumns extends Partial<TTable['_']['columns']> = TTable['_']['columns'],
> {
  db: PostgresJsDatabase<TSchema>
  table: TTable
  columns?: TColumns
  orderByColumn: SQL
  where?: SQL
  pagination: PaginationFilter
}

export async function withPagination<
  TSchema extends Record<string, unknown> = any,
  TTable extends Table = Table,
  TColumns extends Partial<TTable['_']['columns']> = TTable['_']['columns'],
>({
  db,
  table,
  columns,
  orderByColumn,
  pagination: { page, limit },
  where,
}: WithPaginationParams<TSchema, TTable, TColumns>): Promise<
  Pagination<InferSelectModel<TTable>>
> {
  const data = (await db
    .select(columns as any)
    .from(table as any)
    .$dynamic()
    .where(where)
    .orderBy(orderByColumn)
    .limit(limit)
    .offset((page - 1) * limit)) as InferSelectModel<TTable>[]

  const countQuery = db
    .select({ total: sql<number>`count(*)` })
    .from(table as any)
    .$dynamic()

  const [{ total }] = where ? await countQuery.where(where) : await countQuery

  return paginate<InferSelectModel<TTable>>({
    data,
    total: Number(total),
    options: { page, limit },
  })
}
