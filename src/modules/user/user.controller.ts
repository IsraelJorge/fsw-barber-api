import type { FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'

import { IdInput } from '@/shared/schemas/id.schema'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import type { CreateUserInput, UpdateUserInput } from './user.schema'
import { UserService } from './user.service'

@injectable()
export class UserController {
  constructor(
    @inject('UserService')
    private readonly service: UserService,
  ) {}

  async findAll(reply: FastifyReply) {
    const users = await this.service.findAll()
    return reply.status(HTTP_STATUS.OK).send(users)
  }

  async findById(params: IdInput, reply: FastifyReply) {
    const user = await this.service.findById(params.id)
    return reply.status(HTTP_STATUS.OK).send(user)
  }

  async create(body: CreateUserInput, reply: FastifyReply) {
    const user = await this.service.create(body)
    return reply.status(HTTP_STATUS.CREATED).send(user)
  }

  async update(params: IdInput, body: UpdateUserInput, reply: FastifyReply) {
    const user = await this.service.update(params.id, body)
    return reply.status(HTTP_STATUS.OK).send(user)
  }

  async delete(params: IdInput, reply: FastifyReply) {
    await this.service.delete(params.id)
    return reply.status(HTTP_STATUS.NO_CONTENT).send()
  }
}
