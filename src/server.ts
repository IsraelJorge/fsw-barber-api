import 'reflect-metadata'
import '@/shared/container'

import { app } from './shared/app'
import { ENV } from './shared/utils/env'

async function start() {
  try {
    await app.listen({
      port: ENV.PORT,
      host: '0.0.0.0',
    })

    console.log(`🚀 Server running http://localhost:${ENV.PORT}`)
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

const gracefulShutdown = async () => {
  await app.close()
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

start()
