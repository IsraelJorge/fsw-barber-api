import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction,
} from 'fastify'

import { authRoutes } from '@/modules/auth/auth.routes'
import { barberShopRoutes } from '@/modules/barber-shop/barber-shop.routes'
import { serviceRoutes } from '@/modules/service/service.routes'
import { userRoutes } from '@/modules/user/user.routes'

export function routes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction,
) {
  app.register(authRoutes)
  app.register(userRoutes)
  app.register(barberShopRoutes)
  app.register(serviceRoutes)

  done()
}
