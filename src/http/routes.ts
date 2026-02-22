import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction,
} from 'fastify'

import { authRoutes } from '@/modules/auth/auth.routes'
import { userRoutes } from '@/modules/user/user.routes'

export function routes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction,
) {
  app.register(authRoutes)
  app.register(userRoutes)

  done()
}
