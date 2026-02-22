import bcrypt from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { AppError } from '@/shared/errors/app-error'
import { MessageError } from '@/shared/errors/message-error'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import { AuthRepository } from './auth.repository'
import type { LoginInput } from './auth.schema'

@injectable()
export class AuthService {
  constructor(
    @inject('AuthRepository')
    private readonly authRepository: AuthRepository,
  ) {}

  async login(data: LoginInput) {
    const user = await this.authRepository.findByEmail(data.email)

    if (!user || !user.password) {
      throw new AppError({
        message: MessageError.INVALID_CREDENTIALS,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordMatch) {
      throw new AppError({
        message: MessageError.INVALID_CREDENTIALS,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    }

    return user
  }
}
