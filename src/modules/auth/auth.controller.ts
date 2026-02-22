import type { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'tsyringe'

import { HTTP_STATUS } from '@/shared/utils/http-status'

import type { LoginInput } from './auth.schema'
import { AuthService } from './auth.service'

@injectable()
export class AuthController {
  constructor(
    @inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ) {
    const { body } = request

    const user = await this.authService.login(body)

    const token = request.server.jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      { sub: user.id },
    )

    return reply.status(HTTP_STATUS.OK).send({ user, token })
  }
}
