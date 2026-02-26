import { and, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db, DbTransaction } from '@/db'
import { barberShopHourTable } from '@/db/schemas/barber-shop-hour'
import {
  selectColumnsQueryBuilder,
  SelectedColumns,
} from '@/shared/utils/select-columns'

import { CreateBarberShopHourInput } from './barber-shop-hour.schema'

const selectedColumns = {
  id: true,
  barberShopId: true,
  dayOfWeek: true,
  openTime: true,
  closeTime: true,
  isClosed: true,
} as const satisfies SelectedColumns<typeof barberShopHourTable>

const columns = selectColumnsQueryBuilder(barberShopHourTable)(selectedColumns)

@injectable()
export class BarberShopHourRepository {
  async findByBarberShopId(barberShopId: string) {
    return await db
      .select(columns)
      .from(barberShopHourTable)
      .where(eq(barberShopHourTable.barberShopId, barberShopId))
  }

  async createMany(
    barberShopId: string,
    hours: CreateBarberShopHourInput[],
    tx?: DbTransaction,
  ) {
    if (!hours || hours.length === 0) return []

    const dbInstance = tx || db
    return await dbInstance
      .insert(barberShopHourTable)
      .values(
        hours.map((hour) => ({
          ...hour,
          barberShopId,
        })),
      )
      .returning(columns)
  }

  async updateSingleByDay(
    barberShopId: string,
    data: CreateBarberShopHourInput,
    tx?: DbTransaction,
  ) {
    const dbInstance = tx || db
    const [hour] = await dbInstance
      .update(barberShopHourTable)
      .set(data)
      .where(
        and(
          eq(barberShopHourTable.barberShopId, barberShopId),
          eq(barberShopHourTable.dayOfWeek, data.dayOfWeek),
        ),
      )
      .returning(columns)
    return hour
  }
}
