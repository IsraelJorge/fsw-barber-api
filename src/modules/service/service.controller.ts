import type { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'tsyringe'

import { PaginationFilter } from '@/shared/pagination'
import { IdInput } from '@/shared/schemas/id.schema'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import type {
  CreateServiceInput,
  ServiceFilters,
  UpdateServiceInput,
} from './service.schema'
import { ServiceService } from './service.service'

@injectable()
export class ServiceController {
  constructor(
    @inject('ServiceService')
    private readonly serviceService: ServiceService,
  ) {}

  async findAll(
    request: FastifyRequest<{
      Querystring: PaginationFilter<ServiceFilters>
    }>,
    reply: FastifyReply,
  ) {
    const { query } = request

    const services = await this.serviceService.findAll({ filters: query })
    return reply.status(HTTP_STATUS.OK).send(services)
  }

  async findById(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    const service = await this.serviceService.findById(params.id)
    return reply.status(HTTP_STATUS.OK).send(service)
  }

  async create(
    request: FastifyRequest<{
      Body: CreateServiceInput
    }>,
    reply: FastifyReply,
  ) {
    const { body } = request

    const service = await this.serviceService.create(body)
    return reply.status(HTTP_STATUS.CREATED).send(service)
  }

  async update(
    request: FastifyRequest<{
      Params: IdInput
      Body: UpdateServiceInput
    }>,
    reply: FastifyReply,
  ) {
    const { params, body } = request

    const service = await this.serviceService.update(params.id, body)
    return reply.status(HTTP_STATUS.OK).send(service)
  }

  async delete(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    await this.serviceService.delete(params.id)
    return reply.status(HTTP_STATUS.NO_CONTENT).send()
  }
}
