import { reset, seed } from 'drizzle-seed'

import { db, sql } from '@/db'
import { schemas } from '@/db/schemas'

const getUrlAvatar = () => {
  const id = Math.floor(Math.random() * 100) + 1
  return `https://i.pravatar.cc/150?u=${id}`
}

const getShopImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512496015851-a1fbbfc6d1e9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
  ]
  return images[Math.floor(Math.random() * images.length)]
}

async function main() {
  await reset(db.raw, schemas)

  await seed(db.raw, schemas).refine((f) => {
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
      barberShopTable: {
        count: 5,
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
      },
      barberShopPhoneTable: {
        count: 10,
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
      },
      barberShopHourTable: {
        count: 35,
        columns: {
          dayOfWeek: f.valuesFromArray({ values: [0, 1, 2, 3, 4, 5, 6] }),
          openTime: f.default({ defaultValue: '09:00' }),
          closeTime: f.default({ defaultValue: '18:00' }),
          isClosed: f.weightedRandom([
            { value: f.default({ defaultValue: false }), weight: 0.8 },
            { value: f.default({ defaultValue: true }), weight: 0.2 },
          ]),
        },
      },
      serviceTable: {
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
      },
    }
  })

  await sql.end()

  console.log('Database seeded 📦')
}

main()
