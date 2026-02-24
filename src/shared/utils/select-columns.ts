import { Table } from 'drizzle-orm'

/**
 * Type-safe column selector builder.
 *
 * Usage:
 * ```ts
 * const columns = selectColumns(userTable)(t => ({
 *   id: t.id,
 *   name: t.name,
 * }))
 * ```
 */
export function selectColumns<TTable extends Table>(table: TTable) {
  return function <TColumns extends Partial<TTable['_']['columns']>>(
    selector: (table: TTable) => TColumns,
  ): TColumns {
    return selector(table)
  }
}
