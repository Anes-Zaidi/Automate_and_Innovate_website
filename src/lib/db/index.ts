import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.')
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  })

  return drizzle(pool, { schema })
}

export * from './schema'
