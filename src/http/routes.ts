import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction,
} from 'fastify'

import { userRoutes } from '@/modules/user/user.routes'

export function routes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction,
) {
  app.register(userRoutes)

  done()
}
