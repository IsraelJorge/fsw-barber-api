import 'reflect-metadata'

import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { userRoutes } from './modules/user/user.routes'
import { ENV } from './shared/env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(userRoutes)

app
  .listen({ port: ENV.PORT })
  .then(() => console.log(`🚀 Server running http://localhost:${ENV.PORT}`))
