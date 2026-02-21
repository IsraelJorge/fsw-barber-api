import { eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db } from '@/db'
import { userTable } from '@/db/schemas/user'

import type { CreateUserInput, UpdateUserInput } from './user.schema'

@injectable()
export class UserRepository {
  async findAll() {
    return db.select().from(userTable)
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
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning()
    return user
  }
}
