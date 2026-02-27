import { desc, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db, DbTransaction } from '@/db'
import { barberShopPhoneTable } from '@/db/schemas/barber-shop-phone'
import { selectColumnsQueryBuilder } from '@/shared/utils/select-columns'

const columns = selectColumnsQueryBuilder(barberShopPhoneTable)({
  id: true,
  barberShopId: true,
  phone: true,
  createdAt: true,
})

@injectable()
export class BarberShopPhoneRepository {
  async findByBarberShopId(barberShopId: string) {
    return await db.raw
      .select(columns)
      .from(barberShopPhoneTable)
      .where(eq(barberShopPhoneTable.barberShopId, barberShopId))
      .orderBy(desc(barberShopPhoneTable.createdAt))
  }

  async createMany(barberShopId: string, phones: string[], tx?: DbTransaction) {
    if (!phones || phones.length === 0) return []

    const dbInstance = tx || db
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

  async deleteByBarberShopId(barberShopId: string, tx?: DbTransaction) {
    const dbInstance = tx || db
    return await dbInstance.raw
      .delete(barberShopPhoneTable)
      .where(eq(barberShopPhoneTable.barberShopId, barberShopId))
  }
}
