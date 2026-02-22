import { container } from 'tsyringe'

import { AuthRepository } from '@/modules/auth/auth.repository'
import { UserRepository } from '@/modules/user/user.repository'

container.registerSingleton<AuthRepository>('AuthRepository', AuthRepository)
container.registerSingleton<UserRepository>('UserRepository', UserRepository)
