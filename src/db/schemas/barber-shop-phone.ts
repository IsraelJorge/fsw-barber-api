import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { barberShopTable } from './barber-shop'

export const barberShopPhoneTable = pgTable('barber_shop_phone', {
  id: uuid('id').primaryKey().defaultRandom(),
  barberShopId: uuid('barber_shop_id')
    .notNull()
    .references(() => barberShopTable.id),
  phone: varchar('phone').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const barberShopPhoneTableRelations = relations(
  barberShopPhoneTable,
  ({ one }) => ({
    barberShop: one(barberShopTable, {
      fields: [barberShopPhoneTable.barberShopId],
      references: [barberShopTable.id],
    }),
  }),
)
