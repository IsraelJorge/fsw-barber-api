import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { AuthController } from './auth.controller'
import { LoginSchema } from './auth.schema'

export function authRoutes(app: FastifyInstance) {
  const controller = container.resolve(AuthController)

  app.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginSchema,
      },
    },
    controller.login.bind(controller),
  )
}
