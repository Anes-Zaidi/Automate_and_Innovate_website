import { pgTable, text, timestamp, boolean, uuid, varchar } from 'drizzle-orm/pg-core'

/**
 * Participants table schema
 * Stores all hackathon registration information
 */
export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamName: varchar('team_name', { length: 100 }),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  university: varchar('university', { length: 255 }).notNull(),
  specialty: varchar('specialty', { length: 100 }).notNull(),
  year: varchar('year', { length: 10 }).notNull(),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Participant = typeof participants.$inferSelect
export type NewParticipant = typeof participants.$inferInsert
