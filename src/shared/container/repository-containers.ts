import { container } from 'tsyringe'

import { AuthRepository } from '@/modules/auth/auth.repository'
import { BarberShopRepository } from '@/modules/barber-shop/barber-shop.repository'
import { BarberShopHourRepository } from '@/modules/barber-shop-hour/barber-shop-hour.repository'
import { BarberShopPhoneRepository } from '@/modules/barber-shop-phone/barber-shop-phone.repository'
import { UserRepository } from '@/modules/user/user.repository'

container.registerSingleton<AuthRepository>('AuthRepository', AuthRepository)
container.registerSingleton<UserRepository>('UserRepository', UserRepository)
container.registerSingleton<BarberShopRepository>(
  'BarberShopRepository',
  BarberShopRepository,
)
container.registerSingleton<BarberShopHourRepository>(
  'BarberShopHourRepository',
  BarberShopHourRepository,
)
container.registerSingleton<BarberShopPhoneRepository>(
  'BarberShopPhoneRepository',
  BarberShopPhoneRepository,
)
