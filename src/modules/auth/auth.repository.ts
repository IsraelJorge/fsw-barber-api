import { eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'

import { db } from '@/db'
import { userTable } from '@/db/schemas/user'

@injectable()
export class AuthRepository {
  async findByEmail(email: string) {
    const [user] = await db.raw
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
    return user
  }
}
