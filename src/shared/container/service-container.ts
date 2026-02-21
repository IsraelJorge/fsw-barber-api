import { container } from 'tsyringe'

import { UserService } from '@/modules/user/user.service'

container.registerSingleton<UserService>('UserService', UserService)
