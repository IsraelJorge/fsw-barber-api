import { inject, injectable } from 'tsyringe'

import { AppError } from '@/shared/app-error'
import { HTTP_STATUS } from '@/shared/http-status'

import { UserRepository } from './user.repository'
import type { CreateUserInput, UpdateUserInput } from './user.schema'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository')
    private readonly repository: UserRepository,
  ) {}

  async findAll() {
    return this.repository.findAll()
  }

  async findById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return user
  }

  async create(data: CreateUserInput) {
    const existingUser = await this.repository.findByEmail(data.email)
    if (existingUser) {
      throw new AppError({
        message: 'User already exists',
        statusCode: HTTP_STATUS.CONFLICT,
      })
    }
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.repository.update(id, data)
  }

  async delete(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.repository.delete(id)
  }
}
