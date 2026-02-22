import { container } from 'tsyringe'

import { AuthService } from '@/modules/auth/auth.service'
import { UserService } from '@/modules/user/user.service'

container.registerSingleton<AuthService>('AuthService', AuthService)
container.registerSingleton<UserService>('UserService', UserService)
