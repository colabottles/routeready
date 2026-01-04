import type { Config } from 'drizzle-kit'

export default {
  schema: './server/database/schema/*.ts',
  out: './server/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/routeready',
  },
} satisfies Config