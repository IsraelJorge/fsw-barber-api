import { type HttpStatus } from './http-status'

interface AppErrorParams {
  message: string
  statusCode: HttpStatus
  error?: Error
}

export class AppError extends Error {
  public readonly statusCode: HttpStatus

  constructor({ message, statusCode, error }: AppErrorParams) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.stack = error ? error.stack : undefined
  }
}
