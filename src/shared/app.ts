import 'reflect-metadata'
import './container'

import fastifyJwt from '@fastify/jwt'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { routes } from '@/http/routes'

import { AppError } from './errors/app-error'
import { MessageError } from './errors/message-error'
import { ENV } from './utils/env'
import { HTTP_STATUS } from './utils/http-status'
import { parseValidationErrors } from './utils/parse-validation-errors'

export class App {
  server = Fastify({
    forceCloseConnections: true,
  }).withTypeProvider<ZodTypeProvider>()

  constructor() {
    this.serializers()
    this.plugins()
    this.routes()
    this.exceptionHandler()
  }

  serializers() {
    this.server.setValidatorCompiler(validatorCompiler)
    this.server.setSerializerCompiler(serializerCompiler)
  }

  plugins() {
    this.server.register(fastifyJwt, {
      secret: ENV.JWT_SECRET,
      sign: { expiresIn: '1d' },
    })
  }

  routes() {
    this.server.register(routes)
  }

  exceptionHandler() {
    this.server.setErrorHandler(
      (
        err: Error & {
          statusCode?: number
          validation?: { message?: string }[]
        },
        _req: FastifyRequest,
        res: FastifyReply,
      ) => {
        // Fastify validation error (schema validation)
        if (hasZodFastifySchemaValidationErrors(err)) {
          const firstError = parseValidationErrors(err.validation)[0]
          const errorMessage = firstError || MessageError.VALIDATION_ERROR

          const appError = new AppError({
            message: errorMessage,
            statusCode: HTTP_STATUS.BAD_REQUEST,
            error: err.validation,
          })
          return res.status(HTTP_STATUS.BAD_REQUEST).send(appError.throwError())
        }

        if (err instanceof AppError) {
          return res.status(err.statusCode).send(err.throwError())
        }

        const internalError = new AppError({
          message: err.message,
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error: err,
        })
        this.server.log.error(err)
        return res
          .status(internalError.statusCode)
          .send(internalError.throwError())
      },
    )
  }
}

export const app = new App().server
