import { reset, seed } from 'drizzle-seed'

import { db, sql } from '@/db'
import { schemas } from '@/db/schemas'

const getUrlAvatar = () => {
  const id = Math.floor(Math.random() * 100) + 1
  return `https://i.pravatar.cc/150?u=${id}`
}

async function main() {
  await reset(db, schemas)

  await seed(db, schemas).refine((f) => {
    return {
      userTable: {
        count: 10,
        columns: {
          name: f.firstName(),
          email: f.email(),
          password: f.uuid(),
          role: f.weightedRandom([
            { value: f.default({ defaultValue: 'USER' }), weight: 0.8 },
            { value: f.default({ defaultValue: 'ADMIN' }), weight: 0.1 },
            { value: f.default({ defaultValue: 'BARBER' }), weight: 0.1 },
          ]),
          avatar: f.valuesFromArray({
            values: Array.from({ length: 10 }, getUrlAvatar),
          }),
          updatedAt: f.default({ defaultValue: null }),
          deletedAt: f.default({ defaultValue: null }),
        },
      },
    }
  })

  await sql.end()

  console.log('Database seeded 📦')
}

main()
