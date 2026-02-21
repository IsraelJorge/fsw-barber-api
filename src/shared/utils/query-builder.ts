import type { AnyColumn, GetColumnData } from 'drizzle-orm'
import {
  and,
  eq as drizzleEq,
  ilike as drizzleIlike,
  isNull as drizzleIsNull,
  SQL,
  Table,
} from 'drizzle-orm'

export class QueryBuilder<TTable extends Table> {
  private readonly conditions: SQL[] = []

  constructor(private readonly table: TTable) {}

  eq<K extends keyof TTable & string>(
    field: K,
    value: TTable[K] extends AnyColumn
      ? GetColumnData<TTable[K]> | undefined
      : never,
  ): this {
    if (value !== undefined) {
      this.conditions.push(drizzleEq(this.table[field] as AnyColumn, value))
    }
    return this
  }

  ilike<K extends keyof TTable & string>(
    field: K,
    value: string | undefined,
  ): this {
    if (value !== undefined) {
      this.conditions.push(
        drizzleIlike(this.table[field] as AnyColumn, `%${value}%`),
      )
    }
    return this
  }

  isNull<K extends keyof TTable & string>(field: K): this {
    this.conditions.push(drizzleIsNull(this.table[field] as AnyColumn))
    return this
  }

  build(): SQL | undefined {
    return and(...this.conditions)
  }
}
