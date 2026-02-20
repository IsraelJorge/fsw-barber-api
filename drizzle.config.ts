import { defineConfig } from 'drizzle-kit'

import { ENV } from '@/shared/env'

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/db/schemas/**',
  out: './src/db/migrations',
  dbCredentials: {
    url: `postgresql://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`,
  },
})
