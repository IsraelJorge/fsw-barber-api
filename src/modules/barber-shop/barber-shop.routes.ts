import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'

import { authenticate } from '@/http/middlewares/authenticate'
import { PaginationFilter } from '@/shared/pagination'
import { IdInput, IdSchema } from '@/shared/schemas/id.schema'

import { BarberShopController } from './barber-shop.controller'
import {
  BarberShopFilters,
  BarberShopSchemaResponse,
  CreateBarberShopInput,
  CreateBarberShopSchema,
  UpdateBarberShopInput,
  UpdateBarberShopSchema,
} from './barber-shop.schema'

export function barberShopRoutes(app: FastifyInstance) {
  const controller = container.resolve(BarberShopController)

  app.get<{
    Querystring: PaginationFilter<BarberShopFilters>
  }>(
    '/barber-shops',
    {
      schema: {
        tags: ['Barber Shops'],
        // querystring: BarberShopFiltersSchema,
        // response: {
        //   200: BarberShopPaginationResponseSchema,
        // },
      },
    },
    (request, reply) => controller.findAll(request, reply),
  )

  app.get<{
    Params: IdInput
  }>(
    '/barber-shops/:id',
    {
      schema: {
        tags: ['Barber Shops'],
        params: IdSchema,
        response: {
          200: BarberShopSchemaResponse,
        },
      },
    },
    (request, reply) => controller.findById(request, reply),
  )

  app.post<{
    Body: CreateBarberShopInput
  }>(
    '/barber-shops',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Barber Shops'],
        body: CreateBarberShopSchema,
        response: {
          201: BarberShopSchemaResponse,
        },
      },
    },
    (request, reply) => controller.create(request, reply),
  )

  app.put<{
    Params: IdInput
    Body: UpdateBarberShopInput
  }>(
    '/barber-shops/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Barber Shops'],
        params: IdSchema,
        body: UpdateBarberShopSchema,
        response: {
          200: BarberShopSchemaResponse,
        },
      },
    },
    (request, reply) => controller.update(request, reply),
  )

  app.delete<{
    Params: IdInput
  }>(
    '/barber-shops/:id',
    {
      preHandler: [authenticate],
      schema: {
        tags: ['Barber Shops'],
        params: IdSchema,
      },
    },
    (request, reply) => controller.delete(request, reply),
  )
}
