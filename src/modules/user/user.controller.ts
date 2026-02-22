import type { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'tsyringe'

import { PaginationFilter } from '@/shared/pagination'
import { IdInput } from '@/shared/schemas/id.schema'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from './user.schema'
import { UserService } from './user.service'

@injectable()
export class UserController {
  constructor(
    @inject('UserService')
    private readonly userService: UserService,
  ) {}

  async findAll(
    request: FastifyRequest<{
      Querystring: PaginationFilter<UserFilters>
    }>,
    reply: FastifyReply,
  ) {
    const { query } = request

    const users = await this.userService.findAll({ filters: query })
    return reply.status(HTTP_STATUS.OK).send(users)
  }

  async findById(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    const user = await this.userService.findById(params.id)
    return reply.status(HTTP_STATUS.OK).send(user)
  }

  async create(
    request: FastifyRequest<{
      Body: CreateUserInput
    }>,
    reply: FastifyReply,
  ) {
    const { body } = request

    const user = await this.userService.create(body)
    return reply.status(HTTP_STATUS.CREATED).send(user)
  }

  async update(
    request: FastifyRequest<{
      Params: IdInput
      Body: UpdateUserInput
    }>,
    reply: FastifyReply,
  ) {
    const { params, body } = request

    const user = await this.userService.update(params.id, body)
    return reply.status(HTTP_STATUS.OK).send(user)
  }

  async delete(
    request: FastifyRequest<{
      Params: IdInput
    }>,
    reply: FastifyReply,
  ) {
    const { params } = request

    await this.userService.delete(params.id)
    return reply.status(HTTP_STATUS.NO_CONTENT).send()
  }
}
