/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExtractTablesWithRelations, sql, Table } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { paginate, Pagination, PaginationFilter } from '@/shared/pagination'

import {
  DbQueryConfigFirst,
  DbQueryConfigMany,
  DbQueryResult,
  DbTableName,
  IDatabase,
} from './database.interface'

export class Database<
  TSchema extends Record<string, unknown>,
> implements IDatabase<TSchema> {
  constructor(private readonly db: PostgresJsDatabase<TSchema>) {}

  private getQuery(table: keyof ExtractTablesWithRelations<TSchema>) {
    const query = (this.db.query as any)[table]
    if (!query) {
      throw new Error(`Table ${String(table)} not found in db.query`)
    }
    return query
  }

  async findFirst<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigFirst<TSchema, TTableName>,
  >({
    table,
    config,
  }: {
    table: TTableName
    config?: TQueryConfig
  }): Promise<DbQueryResult<TSchema, TTableName, TQueryConfig> | undefined> {
    return this.getQuery(table).findFirst(config)
  }

  async findMany<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigMany<TSchema, TTableName>,
  >({
    table,
    config,
  }: {
    table: TTableName
    config?: TQueryConfig
  }): Promise<DbQueryResult<TSchema, TTableName, TQueryConfig>[]> {
    return this.getQuery(table).findMany(config)
  }

  async paginate<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigMany<TSchema, TTableName>,
  >({
    table,
    drizzleTable,
    config,
    pagination,
  }: {
    table: TTableName
    drizzleTable: Table
    config?: TQueryConfig
    pagination: PaginationFilter
  }): Promise<Pagination<DbQueryResult<TSchema, TTableName, TQueryConfig>>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const countQuery = this.db
      .select({ total: sql<number>`count(*)` })
      .from(drizzleTable as any)
      .$dynamic()

    const where = config?.where
    const [{ total }] = where
      ? await countQuery.where(where as any)
      : await countQuery

    const data = await this.getQuery(table).findMany({
      ...(config as any),
      limit,
      offset,
    })

    return paginate({
      data: data as any,
      total: Number(total),
      options: { page, limit },
    })
  }

  async transaction<T>(callback: (tx: this) => Promise<T>): Promise<T> {
    return this.db.transaction(async (trx) => {
      const transactionalDb = new Database<TSchema>(trx as any) as this
      return callback(transactionalDb)
    })
  }

  get raw() {
    return this.db
  }
}
