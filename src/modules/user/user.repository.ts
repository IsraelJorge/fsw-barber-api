import { desc, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import { QueryBuilder } from '@/db/helpers/query-builder'
import {
  selectColumnsQueryBuilder,
  SelectedColumns,
} from '@/db/helpers/select-columns'
import { userTable } from '@/db/schemas/user'
import { PaginationParams } from '@/shared/pagination'

import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from './user.schema'

const selectedColumns = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const satisfies SelectedColumns<typeof userTable>

const columns = selectColumnsQueryBuilder(userTable)(selectedColumns)

@injectable()
export class UserRepository {
  constructor(
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findAll({ filters }: PaginationParams<UserFilters>) {
    const where = new QueryBuilder(userTable)
      .ilike('name', `${filters.name}%`)
      .ilike('email', `${filters.email}%`)
      .build()

    return this.db.paginate({
      table: 'userTable',
      drizzleTable: userTable,
      config: {
        columns: selectedColumns,
        orderBy: [desc(userTable.createdAt)],
        where,
      },
      pagination: { page: filters.page, limit: filters.limit },
    })
  }

  async findById(id: string) {
    const [user] = await this.db.raw
      .select(columns)
      .from(userTable)
      .where(eq(userTable.id, id))
    return user
  }

  async findByEmail(email: string) {
    const [user] = await this.db.raw
      .select(columns)
      .from(userTable)
      .where(eq(userTable.email, email))
    return user
  }

  async create(data: CreateUserInput) {
    const [user] = await this.db.raw
      .insert(userTable)
      .values(data)
      .returning(columns)
    return user
  }

  async update(id: string, data: UpdateUserInput) {
    const [user] = await this.db.raw
      .update(userTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userTable.id, id))
      .returning(columns)
    return user
  }

  async delete(id: string) {
    return await this.db.raw
      .update(userTable)
      .set({ deletedAt: new Date() })
      .where(eq(userTable.id, id))
  }
}
