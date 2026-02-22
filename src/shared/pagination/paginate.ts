/* eslint-disable @typescript-eslint/no-explicit-any */
import { SQL, sql, Table } from 'drizzle-orm'
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
> {
  db: PostgresJsDatabase<TSchema>
  table: Table
  orderByColumn: SQL
  where?: SQL
  pagination: PaginationFilter
}

export async function withPagination<
  TRow extends Record<string, unknown>,
  TSchema extends Record<string, unknown> = any,
>({
  db,
  table,
  orderByColumn,
  pagination: { page, limit },
  where,
}: WithPaginationParams<TSchema>): Promise<Pagination<TRow>> {
  const data = (await db
    .select()
    .from(table)
    .$dynamic()
    .where(where)
    .orderBy(orderByColumn)
    .limit(limit)
    .offset((page - 1) * limit)) as TRow[]

  const countQuery = db
    .select({ total: sql<number>`count(*)` })
    .from(table)
    .$dynamic()

  const [{ total }] = where ? await countQuery.where(where) : await countQuery

  return paginate<TRow>({
    data,
    total: Number(total),
    options: { page, limit },
  })
}
