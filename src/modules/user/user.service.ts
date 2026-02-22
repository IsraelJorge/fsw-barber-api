import bcrypt from 'bcryptjs'
import { inject, injectable } from 'tsyringe'

import { AppError } from '@/shared/errors/app-error'
import { MessageError } from '@/shared/errors/message-error'
import { PaginationParams } from '@/shared/pagination/types'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import { UserRepository } from './user.repository'
import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from './user.schema'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(params: PaginationParams<UserFilters>) {
    return this.userRepository.findAll(params)
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError({
        message: MessageError.USER_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return user
  }

  async create(data: CreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new AppError({
        message: MessageError.USER_ALREADY_EXISTS,
        statusCode: HTTP_STATUS.CONFLICT,
      })
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined

    return this.userRepository.create({ ...data, password: hashedPassword })
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError({
        message: MessageError.USER_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.userRepository.update(id, data)
  }

  async delete(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError({
        message: MessageError.USER_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.userRepository.delete(id)
  }
}
