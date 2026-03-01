import { TSeedHelper } from '../types'

export const barberShopHourTableSeed: TSeedHelper<'barberShopHourTable'> = (
  f,
) => ({
  count: 5,
  columns: {
    dayOfWeek: f.valuesFromArray({ values: [0, 1, 2, 3, 4, 5, 6] }),
    openTime: f.default({ defaultValue: '09:00' }),
    closeTime: f.default({ defaultValue: '18:00' }),
    isClosed: f.weightedRandom([
      { value: f.default({ defaultValue: false }), weight: 0.8 },
      { value: f.default({ defaultValue: true }), weight: 0.2 },
    ]),
  },
})
