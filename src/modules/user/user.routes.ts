import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { IdSchema } from '@/shared/schemas/id.schema'
import { PaginationSchema } from '@/shared/schemas/pagination.schema'

import { UserController } from './user.controller'
import { CreateUserSchema, UpdateUserSchema } from './user.schema'

export function userRoutes(app: FastifyInstance) {
  const controller = container.resolve(UserController)

  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        querystring: PaginationSchema,
      },
    },
    controller.findAll,
  )

  app.get(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    controller.findById,
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUserSchema,
      },
    },
    controller.create,
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
    controller.update,
  )

  app.delete(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    controller.delete,
  )
}
