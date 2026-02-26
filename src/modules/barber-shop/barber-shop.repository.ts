import { desc, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db, DbTransaction } from '@/db'
import { barberShopTable } from '@/db/schemas/barber-shop'
import { PaginationParams, withPagination } from '@/shared/pagination'
import { QueryBuilder } from '@/shared/utils/query-builder'
import { selectColumns } from '@/shared/utils/select-columns'

import type {
  BarberShopFilters,
  CreateBarberShopInput,
  UpdateBarberShopInput,
} from './barber-shop.schema'

const columns = selectColumns(barberShopTable)({
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  street: true,
  number: true,
  neighborhood: true,
  city: true,
  state: true,
  zipCode: true,
  barberUserId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

@injectable()
export class BarberShopRepository {
  async findAll({ filters }: PaginationParams<BarberShopFilters>) {
    const where = new QueryBuilder(barberShopTable)
      .ilike('name', `${filters.name}%`)
      .ilike('city', `${filters.city}%`)
      .ilike('state', `${filters.state}%`)
      .ilike('neighborhood', `${filters.neighborhood}%`)
      .eq('barberUserId', filters.barberUserId)
      .build()

    return withPagination({
      db,
      table: barberShopTable,
      columns,
      orderByColumn: desc(barberShopTable.createdAt),
      pagination: { page: filters.page, limit: filters.limit },
      where,
    })
  }

  async findById(id: string) {
    const [barberShop] = await db
      .select(columns)
      .from(barberShopTable)
      .where(eq(barberShopTable.id, id))
    return barberShop
  }

  async create(
    data: Omit<CreateBarberShopInput, 'phones' | 'hours'>,
    tx?: DbTransaction,
  ) {
    const dbInstance = tx || db
    const [barberShop] = await dbInstance
      .insert(barberShopTable)
      .values(data)
      .returning(columns)

    return barberShop
  }

  async update(
    id: string,
    data: Omit<UpdateBarberShopInput, 'phones' | 'hours'>,
    tx?: DbTransaction,
  ) {
    const dbInstance = tx || db
    const [barberShop] =
      Object.keys(data).length > 0
        ? await dbInstance
            .update(barberShopTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(barberShopTable.id, id))
            .returning(columns)
        : await dbInstance
            .select(columns)
            .from(barberShopTable)
            .where(eq(barberShopTable.id, id))

    return barberShop
  }

  async delete(id: string, tx?: DbTransaction) {
    const dbInstance = tx || db
    return await dbInstance
      .update(barberShopTable)
      .set({ deletedAt: new Date() })
      .where(eq(barberShopTable.id, id))
  }
}
