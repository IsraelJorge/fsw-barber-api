import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { authenticate } from '@/http/middlewares/authenticate'
import { PaginationFilter } from '@/shared/pagination'
import { IdInput, IdSchema } from '@/shared/schemas/id.schema'

import { UserController } from './user.controller'
import {
  CreateUserInput,
  CreateUserSchema,
  UpdateUserInput,
  UpdateUserSchema,
  UserFilters,
  UserFiltersSchema,
  UserPaginationResponseSchema,
  UserSchemaResponse,
} from './user.schema'

export function userRoutes(app: FastifyInstance) {
  const controller = container.resolve(UserController)

  app.get<{
    Querystring: PaginationFilter<UserFilters>
  }>(
    '/users',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        querystring: UserFiltersSchema,
        response: {
          200: UserPaginationResponseSchema,
        },
      },
    },
    (request, reply) => controller.findAll(request, reply),
  )

  app.get<{
    Params: IdInput
  }>(
    '/users/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        params: IdSchema,
        response: {
          200: UserSchemaResponse,
        },
      },
    },
    (request, reply) => controller.findById(request, reply),
  )

  app.post<{
    Body: CreateUserInput
  }>(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUserSchema,
        response: {
          201: UserSchemaResponse,
        },
      },
    },
    (request, reply) => controller.create(request, reply),
  )

  app.put<{
    Params: IdInput
    Body: UpdateUserInput
  }>(
    '/users/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        params: IdSchema,
        body: UpdateUserSchema,
        response: {
          200: UserSchemaResponse,
        },
      },
    },
    (request, reply) => controller.update(request, reply),
  )

  app.delete<{
    Params: IdInput
  }>(
    '/users/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Users'],
        params: IdSchema,
      },
    },
    (request, reply) => controller.delete(request, reply),
  )
}
