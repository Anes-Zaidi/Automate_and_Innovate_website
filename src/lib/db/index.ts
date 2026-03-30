import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file.')
  }
  
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}

export * from './schema'
