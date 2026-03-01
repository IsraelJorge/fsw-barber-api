import { eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import { userTable } from '@/db/schemas/user'

@injectable()
export class AuthRepository {
  constructor(
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findByEmail(email: string) {
    const [user] = await this.db.raw
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
    return user
  }
}
