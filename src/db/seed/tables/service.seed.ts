import { TSeedHelper } from '../types'

export const serviceTableSeed: TSeedHelper<'serviceTable'> = (f) => ({
  count: 10,
  columns: {
    name: f.valuesFromArray({
      values: [
        'Corte Masculino',
        'Barba',
        'Corte + Barba',
        'Corte Infantil',
        'Pigmentação de Barba',
      ],
    }),
    description: f.valuesFromArray({
      values: [
        'Corte clássico e moderno para cavalheiros.',
        'Barba bem cuidada e estilizada.',
        'Corte e barba em um só lugar.',
        'Corte especial para os pequenos.',
        'Pigmentação natural e duradoura.',
      ],
    }),
    imageUrl: f.valuesFromArray({
      values: [
        'https://images.unsplash.com/photo-1512496015851-a1fbbfc6d1e9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
      ],
    }),
    priceInCents: f.valuesFromArray({
      values: [2000, 3000, 4000, 5000],
    }),
    durationMinutes: f.valuesFromArray({
      values: [20, 30, 40, 50, 60],
    }),
    updatedAt: f.default({ defaultValue: null }),
    deletedAt: f.default({ defaultValue: null }),
  },
})
