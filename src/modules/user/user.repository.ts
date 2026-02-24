import { desc, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db } from '@/db'
import { userTable } from '@/db/schemas/user'
import { PaginationParams, withPagination } from '@/shared/pagination'
import { QueryBuilder } from '@/shared/utils/query-builder'
import { selectColumns } from '@/shared/utils/select-columns'

import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from './user.schema'

const columns = selectColumns(userTable)((t) => ({
  id: t.id,
  name: t.name,
  email: t.email,
  avatar: t.avatar,
  role: t.role,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  deletedAt: t.deletedAt,
}))

@injectable()
export class UserRepository {
  async findAll({ filters }: PaginationParams<UserFilters>) {
    const where = new QueryBuilder(userTable)
      .ilike('name', `${filters.name}%`)
      .ilike('email', `${filters.email}%`)
      .build()

    return withPagination({
      db,
      table: userTable,
      columns,
      orderByColumn: desc(userTable.createdAt),
      pagination: { page: filters.page, limit: filters.limit },
      where,
    })
  }

  async findById(id: string) {
    const [user] = await db
      .select(columns)
      .from(userTable)
      .where(eq(userTable.id, id))
    return user
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select(columns)
      .from(userTable)
      .where(eq(userTable.email, email))
    return user
  }

  async create(data: CreateUserInput) {
    const [user] = await db.insert(userTable).values(data).returning(columns)
    return user
  }

  async update(id: string, data: UpdateUserInput) {
    const [user] = await db
      .update(userTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userTable.id, id))
      .returning(columns)
    return user
  }

  async delete(id: string) {
    return await db
      .update(userTable)
      .set({ deletedAt: new Date() })
      .where(eq(userTable.id, id))
  }
}
