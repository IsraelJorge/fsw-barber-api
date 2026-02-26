import { z } from 'zod'

export const BarberShopPhoneSchemaResponse = z.object({
  id: z.string(),
  barberShopId: z.string(),
  phone: z.string(),
  createdAt: z.date(),
})

export type BarberShopPhoneResponse = z.infer<
  typeof BarberShopPhoneSchemaResponse
>
