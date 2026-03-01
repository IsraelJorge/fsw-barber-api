import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { authenticate } from '@/http/middlewares/authenticate'
import { PaginationFilter } from '@/shared/pagination'
import { IdInput, IdSchema } from '@/shared/schemas/id.schema'

import { ServiceController } from './service.controller'
import {
  CreateServiceInput,
  CreateServiceSchema,
  ServiceFilters,
  ServiceFiltersSchema,
  UpdateServiceInput,
  UpdateServiceSchema,
} from './service.schema'

export function serviceRoutes(app: FastifyInstance) {
  const controller = container.resolve(ServiceController)

  app.get<{
    Querystring: PaginationFilter<ServiceFilters>
  }>(
    '/services',
    {
      schema: {
        tags: ['Services'],
        querystring: ServiceFiltersSchema,
      },
    },
    (request, reply) => controller.findAll(request, reply),
  )

  app.get<{
    Params: IdInput
  }>(
    '/services/:id',
    {
      schema: {
        tags: ['Services'],
        params: IdSchema,
      },
    },
    (request, reply) => controller.findById(request, reply),
  )

  app.post<{
    Body: CreateServiceInput
  }>(
    '/services',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Services'],
        body: CreateServiceSchema,
      },
    },
    (request, reply) => controller.create(request, reply),
  )

  app.put<{
    Params: IdInput
    Body: UpdateServiceInput
  }>(
    '/services/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Services'],
        params: IdSchema,
        body: UpdateServiceSchema,
      },
    },
    (request, reply) => controller.update(request, reply),
  )

  app.delete<{
    Params: IdInput
  }>(
    '/services/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Services'],
        params: IdSchema,
      },
    },
    (request, reply) => controller.delete(request, reply),
  )
}
