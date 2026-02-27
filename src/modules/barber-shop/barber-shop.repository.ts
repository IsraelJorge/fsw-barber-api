import { desc, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db, DbTransaction } from '@/db'
import { barberShopTable } from '@/db/schemas/barber-shop'
import { PaginationParams } from '@/shared/pagination'
import { QueryBuilder } from '@/shared/utils/query-builder'
import {
  selectColumnsQueryBuilder,
  SelectedColumns,
} from '@/shared/utils/select-columns'

import type {
  BarberShopFilters,
  CreateBarberShopInput,
  UpdateBarberShopInput,
} from './barber-shop.schema'

const selectedColumns = {
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
} as const satisfies SelectedColumns<typeof barberShopTable>

const columns = selectColumnsQueryBuilder(barberShopTable)(selectedColumns)

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

    return db.paginate({
      table: 'barberShopTable',
      drizzleTable: barberShopTable,
      config: {
        columns: selectedColumns,
        orderBy: [desc(barberShopTable.createdAt)],
        where,
        with: {
          barberShopHours: true,
          barberShopPhones: {
            columns: {
              phone: true,
            },
          },
        },
      },
      pagination: { page: filters.page, limit: filters.limit },
    })
  }

  async findById(id: string) {
    const barberShop = await db.findFirst({
      table: 'barberShopTable',
      config: {
        columns: selectedColumns,
        where: eq(barberShopTable.id, id),
        with: {
          barberShopHours: true,
          barberShopPhones: true,
        },
      },
    })

    return barberShop
  }

  async create(
    data: Omit<CreateBarberShopInput, 'phones' | 'hours'>,
    tx?: DbTransaction,
  ) {
    const dbInstance = tx || db
    const [barberShop] = await dbInstance.raw
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
        ? await dbInstance.raw
            .update(barberShopTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(barberShopTable.id, id))
            .returning(columns)
        : await dbInstance.raw
            .select(columns)
            .from(barberShopTable)
            .where(eq(barberShopTable.id, id))

    return barberShop
  }

  async delete(id: string, tx?: DbTransaction) {
    const dbInstance = tx || db
    return await dbInstance.raw
      .update(barberShopTable)
      .set({ deletedAt: new Date() })
      .where(eq(barberShopTable.id, id))
  }
}
