import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { container } from 'tsyringe'

import { IdSchema } from '@/shared/schemas/id.schema'

import { UserController } from './user.controller'
import { CreateUserSchema, UpdateUserSchema } from './user.schema'

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  const controller = container.resolve(UserController)

  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
      },
    },
    async (_, reply) => controller.findAll(reply),
  )

  app.get(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    async (request, reply) => controller.findById(request.params, reply),
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUserSchema,
      },
    },
    async (request, reply) => controller.create(request.body, reply),
  )

  app.put(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
        body: UpdateUserSchema,
      },
    },
    async (request, reply) =>
      controller.update(request.params, request.body, reply),
  )

  app.delete(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    async (request, reply) => controller.delete(request.params, reply),
  )
}
