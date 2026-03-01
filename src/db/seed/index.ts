import { reset, seed } from 'drizzle-seed'

import { db, sql } from '@/db'
import { schemas } from '@/db/schemas'

import { barberShopTableSeed } from './tables/barber-shop.seed'
import { barberShopHourTableSeed } from './tables/barber-shop-hour.seed'
import { barberShopPhoneTableSeed } from './tables/barber-shop-phone.seed'
import { serviceTableSeed } from './tables/service.seed'
import { userTableSeed } from './tables/user.seed'

async function main() {
  await reset(db.raw, schemas)

  await seed(db.raw, schemas).refine((f) => {
    return {
      userTable: userTableSeed(f),
      barberShopTable: barberShopTableSeed(f),
      barberShopPhoneTable: barberShopPhoneTableSeed(f),
      barberShopHourTable: barberShopHourTableSeed(f),
      serviceTable: serviceTableSeed(f),
    }
  })

  await sql.end()

  console.log('Database seeded 📦')
}

main()
