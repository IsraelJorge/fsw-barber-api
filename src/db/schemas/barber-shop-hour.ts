import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, time, uuid } from 'drizzle-orm/pg-core'

import { barberShopTable } from './barber-shop'

export const barberShopHourTable = pgTable('barber_shop_hour', {
  id: uuid('id').primaryKey().defaultRandom(),
  barberShopId: uuid('barber_shop_id')
    .notNull()
    .references(() => barberShopTable.id),
  dayOfWeek: integer('day_of_week').notNull(), // 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
  openTime: time('open_time').notNull(),
  closeTime: time('close_time').notNull(),
  isClosed: boolean('is_closed').notNull().default(false),
})

export const barberShopHourTableRelations = relations(
  barberShopHourTable,
  ({ one }) => ({
    barberShop: one(barberShopTable, {
      fields: [barberShopHourTable.barberShopId],
      references: [barberShopTable.id],
    }),
  }),
)
