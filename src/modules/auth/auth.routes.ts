import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { AuthController } from './auth.controller'
import { LoginInput, LoginResponseSchema, LoginSchema } from './auth.schema'

export function authRoutes(app: FastifyInstance) {
  const controller = container.resolve(AuthController)

  app.post<{
    Body: LoginInput
  }>(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginSchema,
        response: {
          200: LoginResponseSchema,
        },
      },
    },
    (request, reply) => controller.login(request, reply),
  )
}
