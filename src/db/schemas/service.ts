import { relations } from 'drizzle-orm'
import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

import { timestamps } from '../helpers/columns.helpers'
import { barberShopTable } from './barber-shop'

export const serviceTable = pgTable('service', {
  id: uuid('id').primaryKey().defaultRandom(),
  barberShopId: uuid('barber_shop_id')
    .notNull()
    .references(() => barberShopTable.id),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url').notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  ...timestamps,
})

export const serviceTableRelations = relations(serviceTable, ({ one }) => ({
  barberShop: one(barberShopTable, {
    fields: [serviceTable.barberShopId],
    references: [barberShopTable.id],
  }),
}))
