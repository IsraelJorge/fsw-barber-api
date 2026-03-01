import { container } from 'tsyringe'

import { db } from '@/db'
import { AuthService } from '@/modules/auth/auth.service'
import { BarberShopService } from '@/modules/barber-shop/barber-shop.service'
import { UserService } from '@/modules/user/user.service'

container.registerInstance('Database', db)
container.registerSingleton<AuthService>('AuthService', AuthService)
container.registerSingleton<UserService>('UserService', UserService)
container.registerSingleton<BarberShopService>(
  'BarberShopService',
  BarberShopService,
)
