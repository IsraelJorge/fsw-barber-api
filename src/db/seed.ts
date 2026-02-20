import { reset, seed } from 'drizzle-seed'

import { db, sql } from '@/db'
import * as schemas from '@/db/schemas'

async function main() {
  await reset(db, schemas)

  await seed(db, schemas).refine((f) => {
    return {
      user: {
        count: 10,
        columns: {
          name: f.firstName(),
          email: f.email(),
          password: f.uuid(),
        },
      },
    }
  })

  await sql.end()

  console.log('Database seeded 📦')
}

main()
