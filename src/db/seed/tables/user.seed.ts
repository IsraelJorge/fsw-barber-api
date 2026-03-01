import { TSeedHelper } from '../types'
import { getUrlAvatar } from '../utils'

export const userTableSeed: TSeedHelper<'userTable'> = (f) => ({
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
})
