import { TSeedHelper } from '../types'

export const barberShopPhoneTableSeed: TSeedHelper<'barberShopPhoneTable'> = (
  f,
) => ({
  count: 5,
  columns: {
    phone: f.valuesFromArray({
      values: [
        '(11) 99999-9999',
        '(11) 98888-8888',
        '(11) 97777-7777',
        '(11) 96666-6666',
      ],
    }),
  },
})
