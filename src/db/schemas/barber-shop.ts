import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '../helpers/columns.helpers'
import { barberShopHourTable } from './barber-shop-hour'
import { barberShopPhoneTable } from './barber-shop-phone'
import { userTable } from './user'

export const barberShopTable = pgTable('barber_shop', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url').notNull(),
  street: varchar('street').notNull(),
  number: varchar('number'),
  neighborhood: varchar('neighborhood').notNull(),
  city: varchar('city').notNull(),
  state: varchar('state').notNull(),
  zipCode: varchar('zip_code').notNull(),
  barberUserId: uuid('barber_user_id')
    .notNull()
    .references(() => userTable.id),
  ...timestamps,
})

export const barberShopTableRelations = relations(
  barberShopTable,
  ({ one, many }) => ({
    barberUser: one(userTable, {
      fields: [barberShopTable.barberUserId],
      references: [userTable.id],
    }),
    barberShopHours: many(barberShopHourTable),
    barberShopPhones: many(barberShopPhoneTable),
  }),
)
