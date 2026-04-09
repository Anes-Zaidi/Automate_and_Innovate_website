#!/usr/bin/env node
/**
 * Production migration script
 * Runs database migrations during build on Vercel
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { neon } = require('@neondatabase/serverless')

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.log('No DATABASE_URL found, skipping migrations')
    return
  }

  const sql = neon(databaseUrl)

  try {
    console.log('Running database migrations...')

    // Create teams table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(100) NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      )
    `
    console.log('✓ teams table ready')

    // Add team_id column to participants
    await sql`
      ALTER TABLE participants 
      ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id)
    `
    console.log('✓ team_id column ready')

    // Add is_team_leader column to participants
    await sql`
      ALTER TABLE participants 
      ADD COLUMN IF NOT EXISTS is_team_leader boolean DEFAULT false NOT NULL
    `
    console.log('✓ is_team_leader column ready')

    // Drop team_name column if exists
    await sql`
      ALTER TABLE participants 
      DROP COLUMN IF EXISTS team_name
    `
    console.log('✓ team_name column removed')

    console.log('All migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error.message)
    // Don't fail the build, just warn
    console.warn('Continuing build without database migrations...')
  }
}

runMigrations()
