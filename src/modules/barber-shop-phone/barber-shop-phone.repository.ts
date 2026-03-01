import { desc, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import { selectColumnsQueryBuilder } from '@/db/helpers/select-columns'
import { barberShopPhoneTable } from '@/db/schemas/barber-shop-phone'

const columns = selectColumnsQueryBuilder(barberShopPhoneTable)({
  id: true,
  barberShopId: true,
  phone: true,
  createdAt: true,
})

@injectable()
export class BarberShopPhoneRepository {
  constructor(
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findByBarberShopId(barberShopId: string) {
    return await this.db.raw
      .select(columns)
      .from(barberShopPhoneTable)
      .where(eq(barberShopPhoneTable.barberShopId, barberShopId))
      .orderBy(desc(barberShopPhoneTable.createdAt))
  }

  async createMany(barberShopId: string, phones: string[], tx?: IDatabase) {
    if (!phones || phones.length === 0) return []

    const dbInstance = tx || this.db
    return await dbInstance.raw
      .insert(barberShopPhoneTable)
      .values(
        phones.map((phone) => ({
          barberShopId,
          phone,
        })),
      )
      .returning(columns)
  }

  async deleteByBarberShopId(barberShopId: string, tx?: IDatabase) {
    const dbInstance = tx || this.db
    return await dbInstance.raw
      .delete(barberShopPhoneTable)
      .where(eq(barberShopPhoneTable.barberShopId, barberShopId))
  }
}
