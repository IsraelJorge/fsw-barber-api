import { TSeedHelper } from '../types'
import { getShopImage } from '../utils'

export const barberShopTableSeed: TSeedHelper<'barberShopTable'> = (f) => ({
  count: 10,
  columns: {
    name: f.valuesFromArray({
      values: [
        'Barbearia VIP',
        'Corte de Ouro',
        'The Classic Barber',
        'Estilo & Arte',
        'Navalha de Ouro',
      ],
    }),
    description: f.valuesFromArray({
      values: [
        'A melhor barbearia da cidade.',
        'Estilo e elegância em um só lugar.',
        'Corte clássico e moderno para cavalheiros.',
        'Sua melhor experiência em barbearia.',
        'Tradição, qualidade e respeito.',
      ],
    }),
    imageUrl: f.valuesFromArray({
      values: Array.from({ length: 5 }, getShopImage),
    }),
    updatedAt: f.default({ defaultValue: null }),
    deletedAt: f.default({ defaultValue: null }),
  },
})
