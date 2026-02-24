import { desc, eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db } from '@/db'
import { userTable } from '@/db/schemas/user'
import { PaginationParams, withPagination } from '@/shared/pagination'
import { QueryBuilder } from '@/shared/utils/query-builder'

import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from './user.schema'

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
      orderByColumn: desc(userTable.createdAt),
      pagination: { page: filters.page, limit: filters.limit },
      where,
    })
  }

  async findById(id: string) {
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id))
    return user
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
    return user
  }

  async create(data: CreateUserInput) {
    const [user] = await db.insert(userTable).values(data).returning()
    return user
  }

  async update(id: string, data: UpdateUserInput) {
    const [user] = await db
      .update(userTable)
      .set(data)
      .where(eq(userTable.id, id))
      .returning()
    return user
  }

  async delete(id: string) {
    const [user] = await db
      .update(userTable)
      .set({ deletedAt: new Date() })
      .where(eq(userTable.id, id))
      .returning()
    return user
  }
}
