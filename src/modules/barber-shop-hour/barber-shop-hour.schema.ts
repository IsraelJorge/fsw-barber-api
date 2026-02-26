import { z } from 'zod'

export const BarberShopHourSchemaResponse = z.object({
  id: z.string(),
  barberShopId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string(),
  closeTime: z.string(),
  isClosed: z.boolean(),
})

export type CreateBarberShopHourInput = Omit<
  z.infer<typeof BarberShopHourSchemaResponse>,
  'id' | 'barberShopId'
>

export type BarberShopHourResponse = z.infer<
  typeof BarberShopHourSchemaResponse
>
