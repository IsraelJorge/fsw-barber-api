import { barberShopTable, barberShopTableRelations } from './barber-shop'
import {
  barberShopHourTable,
  barberShopHourTableRelations,
} from './barber-shop-hour'
import {
  barberShopPhoneTable,
  barberShopPhoneTableRelations,
} from './barber-shop-phone'
import { roleEnum, userTable } from './user'

export const schemas = {
  roleEnum,
  userTable,
  barberShopTable,
  barberShopPhoneTable,
  barberShopHourTable,
  barberShopHourTableRelations,
  barberShopPhoneTableRelations,
  barberShopTableRelations,
}
