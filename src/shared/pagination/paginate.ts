/* eslint-disable @typescript-eslint/no-explicit-any */
import { SQL, sql, Table } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import type { Pagination, PaginationOptions } from './types'

type PaginateParams<T> = {
  data: T[]
  total: number
  options: PaginationOptions
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
  pagination: PaginationOptions
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
  const baseQuery = db.select().from(table).$dynamic()
  const filteredQuery = where ? baseQuery.where(where) : baseQuery

  const data = (await filteredQuery
    .orderBy(orderByColumn)
    .limit(limit)
    .offset((page - 1) * limit)) as TRow[]

  const sub = filteredQuery.as('sub')

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(sub)

  return paginate<TRow>({
    data,
    total: Number(total),
    options: { page, limit },
  })
}
