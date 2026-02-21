import { container } from 'tsyringe'

import { UserRepository } from '@/modules/user/user.repository'

container.registerSingleton<UserRepository>('UserRepository', UserRepository)
