import type { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'tsyringe'

import { PaginationFilter } from '@/shared/pagination'
import { IdInput } from '@/shared/schemas/id.schema'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import type {
  BarberShopFilters,
  CreateBarberShopInput,
  UpdateBarberShopInput,
} from './barber-shop.schema'
import { BarberShopService } from './barber-shop.service'

@injectable()
export class BarberShopController {
  constructor(
    @inject('BarberShopService')
    private readonly barberShopService: BarberShopService,
  ) {}

  async findAll(
    request: FastifyRequest<{
      Querystring: PaginationFilter<BarberShopFilters>
    }>,
    reply: FastifyReply,
  ) {
    const { query } = request

    const barberShops = await this.barberShopService.findAll({ filters: query })
    return reply.status(HTTP_STATUS.OK).send(barberShops)
  }

  async findById(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    const barberShop = await this.barberShopService.findById(params.id)
    return reply.status(HTTP_STATUS.OK).send(barberShop)
  }

  async create(
    request: FastifyRequest<{
      Body: CreateBarberShopInput
    }>,
    reply: FastifyReply,
  ) {
    const { body } = request

    const barberShop = await this.barberShopService.create(body)
    return reply.status(HTTP_STATUS.CREATED).send(barberShop)
  }

  async update(
    request: FastifyRequest<{
      Params: IdInput
      Body: UpdateBarberShopInput
    }>,
    reply: FastifyReply,
  ) {
    const { params, body } = request

    const barberShop = await this.barberShopService.update(params.id, body)
    return reply.status(HTTP_STATUS.OK).send(barberShop)
  }

  async delete(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    await this.barberShopService.delete(params.id)
    return reply.status(HTTP_STATUS.NO_CONTENT).send()
  }
}
