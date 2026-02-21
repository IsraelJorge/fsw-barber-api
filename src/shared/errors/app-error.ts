import { type HttpStatus } from '../utils/http-status'

interface AppErrorParams {
  message: string
  statusCode: HttpStatus
  error?: unknown | Error
}

export class AppError extends Error {
  public readonly statusCode: HttpStatus
  public readonly error?: unknown | Error

  constructor({ message, statusCode, error }: AppErrorParams) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.error = error
  }

  public throwError() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      error: this.error,
    }
  }
}
