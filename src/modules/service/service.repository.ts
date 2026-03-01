import { and, desc, eq, isNull } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import { QueryBuilder } from '@/db/helpers/query-builder'
import {
  selectColumnsQueryBuilder,
  SelectedColumns,
} from '@/db/helpers/select-columns'
import { serviceTable } from '@/db/schemas/service'
import { PaginationParams } from '@/shared/pagination'

import type {
  CreateServiceInput,
  ServiceFilters,
  UpdateServiceInput,
} from './service.schema'

const selectedColumns = {
  id: true,
  barberShopId: true,
  name: true,
  description: true,
  imageUrl: true,
  priceInCents: true,
  durationMinutes: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const satisfies SelectedColumns<typeof serviceTable>

const columns = selectColumnsQueryBuilder(serviceTable)(selectedColumns)

@injectable()
export class ServiceRepository {
  constructor(
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findAll({ filters }: PaginationParams<ServiceFilters>) {
    const where = new QueryBuilder(serviceTable)
      .eq('barberShopId', filters.barberShopId)
      .ilike('name', filters.name ? `${filters.name}%` : undefined)
      .build()

    return this.db.paginate({
      table: 'serviceTable',
      drizzleTable: serviceTable,
      config: {
        columns: selectedColumns,
        orderBy: [desc(serviceTable.createdAt)],
        where: and(where, isNull(serviceTable.deletedAt)),
      },
      pagination: { page: filters.page, limit: filters.limit },
    })
  }

  async findById(id: string) {
    return this.db.findFirst({
      table: 'serviceTable',
      config: {
        columns: selectedColumns,
        where: and(eq(serviceTable.id, id), isNull(serviceTable.deletedAt)),
      },
    })
  }

  async create(data: CreateServiceInput, tx?: IDatabase) {
    const dbInstance = tx || this.db
    const [service] = await dbInstance.raw
      .insert(serviceTable)
      .values(data)
      .returning(columns)

    return service
  }

  async update(id: string, data: UpdateServiceInput, tx?: IDatabase) {
    const dbInstance = tx || this.db
    const [service] = await dbInstance.raw
      .update(serviceTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceTable.id, id))
      .returning(columns)

    return service
  }

  async delete(id: string, tx?: IDatabase) {
    const dbInstance = tx || this.db
    return await dbInstance.raw
      .update(serviceTable)
      .set({ deletedAt: new Date() })
      .where(eq(serviceTable.id, id))
  }
}
