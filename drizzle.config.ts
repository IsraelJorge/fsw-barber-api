import { defineConfig } from 'drizzle-kit'

import { ENV } from '@/shared/utils/env'

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/db/schemas/**',
  out: './src/db/migrations',
  dbCredentials: {
    url: ENV.DB_URL,
  },
})
