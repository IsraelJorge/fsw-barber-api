import type { FastifyRequest } from 'fastify'

import { AppError } from '@/shared/errors/app-error'
import { MessageError } from '@/shared/errors/message-error'
import { HTTP_STATUS } from '@/shared/utils/http-status'

export async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch {
    throw new AppError({
      message: MessageError.UNAUTHORIZED,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
    })
  }
}
