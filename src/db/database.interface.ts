import {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  Table,
} from 'drizzle-orm'

import { Pagination, PaginationFilter } from '@/shared/pagination'

export type DbTableName<TSchema extends Record<string, unknown>> =
  keyof ExtractTablesWithRelations<TSchema>

export type DbQueryConfigMany<
  TSchema extends Record<string, unknown>,
  TTableName extends DbTableName<TSchema>,
> = DBQueryConfig<
  'many',
  true,
  ExtractTablesWithRelations<TSchema>,
  ExtractTablesWithRelations<TSchema>[TTableName]
>

export type DbQueryConfigFirst<
  TSchema extends Record<string, unknown>,
  TTableName extends DbTableName<TSchema>,
> = Omit<DbQueryConfigMany<TSchema, TTableName>, 'limit'>

export type DbQueryResult<
  TSchema extends Record<string, unknown>,
  TTableName extends DbTableName<TSchema>,
  TQueryConfig extends
    | DbQueryConfigMany<TSchema, TTableName>
    | DbQueryConfigFirst<TSchema, TTableName>,
> = BuildQueryResult<
  ExtractTablesWithRelations<TSchema>,
  ExtractTablesWithRelations<TSchema>[TTableName],
  TQueryConfig
>

export interface IDatabase<TSchema extends Record<string, unknown>> {
  findFirst<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigFirst<TSchema, TTableName>,
  >(params: {
    table: TTableName
    config?: TQueryConfig
  }): Promise<DbQueryResult<TSchema, TTableName, TQueryConfig> | undefined>

  findMany<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigMany<TSchema, TTableName>,
  >(params: {
    table: TTableName
    config?: TQueryConfig
  }): Promise<DbQueryResult<TSchema, TTableName, TQueryConfig>[]>

  paginate<
    TTableName extends DbTableName<TSchema>,
    TQueryConfig extends DbQueryConfigMany<TSchema, TTableName>,
  >(params: {
    table: TTableName
    drizzleTable: Table
    config?: TQueryConfig
    pagination: PaginationFilter
  }): Promise<Pagination<DbQueryResult<TSchema, TTableName, TQueryConfig>>>

  transaction<T>(callback: (tx: this) => Promise<T>): Promise<T>

  raw: unknown
}
