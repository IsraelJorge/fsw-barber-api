import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { IdSchema } from '@/shared/schemas/id.schema'

import { UserController } from './user.controller'
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserFiltersSchema,
} from './user.schema'

export function userRoutes(app: FastifyInstance) {
  const controller = container.resolve(UserController)

  app.get(
    '/users',
    {
      schema: {
        tags: ['Users'],
        querystring: UserFiltersSchema,
      },
    },
    controller.findAll.bind(controller),
  )

  app.get(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    controller.findById.bind(controller),
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUserSchema,
      },
    },
    controller.create.bind(controller),
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
    controller.update.bind(controller),
  )

  app.delete(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    controller.delete.bind(controller),
  )
}
