import { inject, injectable } from 'tsyringe'

import { IDatabase } from '@/db'
import { BarberShopHourRepository } from '@/modules/barber-shop-hour/barber-shop-hour.repository'
import { BarberShopPhoneRepository } from '@/modules/barber-shop-phone/barber-shop-phone.repository'
import { UserRepository } from '@/modules/user/user.repository'
import { AppError } from '@/shared/errors/app-error'
import { MessageError } from '@/shared/errors/message-error'
import { PaginationParams } from '@/shared/pagination/types'
import { HTTP_STATUS } from '@/shared/utils/http-status'

import { BarberShopRepository } from './barber-shop.repository'
import type {
  BarberShopFilters,
  CreateBarberShopInput,
  UpdateBarberShopInput,
} from './barber-shop.schema'

@injectable()
export class BarberShopService {
  constructor(
    @inject('BarberShopRepository')
    private readonly barberShopRepository: BarberShopRepository,
    @inject('UserRepository')
    private readonly userRepository: UserRepository,
    @inject('BarberShopPhoneRepository')
    private readonly barberShopPhoneRepository: BarberShopPhoneRepository,
    @inject('BarberShopHourRepository')
    private readonly barberShopHourRepository: BarberShopHourRepository,
    @inject('Database')
    private readonly db: IDatabase,
  ) {}

  async findAll(params: PaginationParams<BarberShopFilters>) {
    return this.barberShopRepository.findAll(params)
  }

  async findById(id: string) {
    const barberShop = await this.barberShopRepository.findById(id)
    if (!barberShop) {
      throw new AppError({
        message: MessageError.BARBER_SHOP_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return barberShop
  }

  async create(data: CreateBarberShopInput) {
    const user = await this.userRepository.findById(data.barberUserId)
    if (!user) {
      throw new AppError({
        message: MessageError.USER_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }

    const { phones, hours, ...barberShopData } = data

    return await this.db.transaction(async (tx) => {
      const barberShop = await this.barberShopRepository.create(
        barberShopData,
        tx,
      )

      if (phones && phones.length > 0) {
        await this.barberShopPhoneRepository.createMany(
          barberShop.id,
          phones,
          tx,
        )
      }

      if (hours && hours.length > 0) {
        await this.barberShopHourRepository.createMany(barberShop.id, hours, tx)
      }

      return barberShop
    })
  }

  async update(id: string, data: UpdateBarberShopInput) {
    const barberShop = await this.barberShopRepository.findById(id)
    if (!barberShop) {
      throw new AppError({
        message: MessageError.BARBER_SHOP_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }

    if (data.barberUserId) {
      const user = await this.userRepository.findById(data.barberUserId)
      if (!user) {
        throw new AppError({
          message: MessageError.USER_NOT_FOUND,
          statusCode: HTTP_STATUS.NOT_FOUND,
        })
      }
    }

    const { phones, hours, ...barberShopData } = data

    return await this.db.transaction(async (tx) => {
      const updatedBarberShop = await this.barberShopRepository.update(
        id,
        barberShopData,
        tx,
      )

      if (phones && phones.length > 0) {
        await this.barberShopPhoneRepository.deleteByBarberShopId(id, tx)
        await this.barberShopPhoneRepository.createMany(id, phones, tx)
      }

      if (hours && hours.length > 0) {
        for (const hour of hours) {
          await this.barberShopHourRepository.updateSingleByDay(id, hour, tx)
        }
      }

      return updatedBarberShop
    })
  }

  async delete(id: string) {
    const barberShop = await this.barberShopRepository.findById(id)
    if (!barberShop) {
      throw new AppError({
        message: MessageError.BARBER_SHOP_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
      })
    }
    return this.barberShopRepository.delete(id)
  }
}
