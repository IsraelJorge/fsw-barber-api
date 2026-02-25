import { Table } from 'drizzle-orm'

type ColumnKeys<TTable extends Table> = keyof TTable['_']['columns']

type BooleanSelector<TTable extends Table> = {
  [K in ColumnKeys<TTable>]?: boolean
}

type PickTrueColumns<
  TTable extends Table,
  TSelector extends BooleanSelector<TTable>,
> = {
  [K in keyof TSelector as TSelector[K] extends true
    ? K
    : never]: K extends ColumnKeys<TTable> ? TTable['_']['columns'][K] : never
}

type CallbackSelector<TTable extends Table> = (
  t: TTable,
) => Partial<TTable['_']['columns']>

type SelectColumnsResult<
  TTable extends Table,
  TSelector extends BooleanSelector<TTable> | CallbackSelector<TTable>,
> =
  TSelector extends CallbackSelector<TTable>
    ? ReturnType<TSelector>
    : TSelector extends BooleanSelector<TTable>
      ? PickTrueColumns<TTable, TSelector>
      : never

/**
 * Type-safe column selector builder.
 *
 * Supports two styles:
 *
 * Callback style:
 * ```ts
 * const columns = selectColumns(userTable)((t) => ({
 *   id: t.id,
 *   name: t.name,
 * }))
 * ```
 *
 * Boolean object style:
 * ```ts
 * const columns = selectColumns(userTable)({
 *   id: true,
 *   name: true,
 * })
 * ```
 */
export function selectColumns<TTable extends Table>(table: TTable) {
  return function <
    TSelector extends BooleanSelector<TTable> | CallbackSelector<TTable>,
  >(selector: TSelector): SelectColumnsResult<TTable, TSelector> {
    if (typeof selector === 'function') {
      return selector(table) as never
    }

    const result: Record<string, unknown> = {}
    for (const key in selector) {
      if (selector[key] === true) {
        result[key] = (table as Record<string, unknown>)[key]
      }
    }
    return result as never
  }
}
