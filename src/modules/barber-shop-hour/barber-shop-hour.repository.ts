import { and, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import {
  selectColumnsQueryBuilder,
  SelectedColumns,
} from '@/db/helpers/select-columns'
import { barberShopHourTable } from '@/db/schemas/barber-shop-hour'

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
  constructor(
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findByBarberShopId(barberShopId: string) {
    return await this.db.raw
      .select(columns)
      .from(barberShopHourTable)
      .where(eq(barberShopHourTable.barberShopId, barberShopId))
  }

  async createMany(
    barberShopId: string,
    hours: CreateBarberShopHourInput[],
    tx?: IDatabase,
  ) {
    if (!hours || hours.length === 0) return []

    const dbInstance = tx || this.db
    return await dbInstance.raw
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
    tx?: IDatabase,
  ) {
    const dbInstance = tx || this.db
    const [hour] = await dbInstance.raw
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
