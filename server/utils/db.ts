// server/utils/db.ts
// Database connection utility using node-postgres

import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getDb() {
  if (!pool) {
    // Use DATABASE_URL if available, otherwise use individual env vars
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
    } else {
      pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'routeready',
        user: process.env.DB_USER || 'routeready_user',
        password: process.env.DB_PASSWORD || 'routeready123',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
    }
  }
  return pool
}