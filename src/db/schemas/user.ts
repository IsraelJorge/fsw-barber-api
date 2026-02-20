import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'BARBER'])

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  avatar: varchar('avatar'),
  email: varchar('email').notNull().unique(),
  role: roleEnum('role').notNull().default('USER'),
  password: varchar('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})
