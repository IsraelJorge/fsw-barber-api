import 'reflect-metadata'
import '@/shared/container'

import { app } from './shared/app'
import { ENV } from './shared/utils/env'

app
  .listen({ port: ENV.PORT })
  .then(() => console.log(`🚀 Server running http://localhost:${ENV.PORT}`))
