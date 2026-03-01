import { inject, injectable } from 'tsyringe'

import { BarberShopRepository } from '@/modules/barber-shop/barber-shop.repository'
import { AppError } from '@/shared/errors/app-error'
import { MessageError } from '@/shared/errors/message-error'
import { PaginationParams } from '@/shared/pagination/types'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import { ServiceRepository } from './service.repository'
import type {
  CreateServiceInput,
  ServiceFilters,
  UpdateServiceInput,
} from './service.schema'

@injectable()
export class ServiceService {
  constructor(
    @inject('ServiceRepository')
    private readonly serviceRepository: ServiceRepository,
    @inject('BarberShopRepository')
    private readonly barberShopRepository: BarberShopRepository,
  ) {}

  async findAll(params: PaginationParams<ServiceFilters>) {
    return this.serviceRepository.findAll(params)
  }

  async findById(id: string) {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new AppError({
        message: MessageError.SERVICE_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return service
  }

  async create(data: CreateServiceInput) {
    const barberShop = await this.barberShopRepository.findById(
      data.barberShopId,
    )
    if (!barberShop) {
      throw new AppError({
        message: MessageError.BARBER_SHOP_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }

    return this.serviceRepository.create(data)
  }

  async update(id: string, data: UpdateServiceInput) {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new AppError({
        message: MessageError.SERVICE_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }

    if (data.barberShopId) {
      const barberShop = await this.barberShopRepository.findById(
        data.barberShopId,
      )
      if (!barberShop) {
        throw new AppError({
          message: MessageError.BARBER_SHOP_NOT_FOUND,
          statusCode: HTTP_STATUS.NOT_FOUND,
        })
      }
    }

    return this.serviceRepository.update(id, data)
  }

  async delete(id: string) {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new AppError({
        message: MessageError.SERVICE_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.serviceRepository.delete(id)
  }
}
