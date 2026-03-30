import { pgTable, text, timestamp, boolean, uuid, varchar, integer } from 'drizzle-orm/pg-core'

/**
 * Teams table schema
 * Stores team information for hackathon registration
 */
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Participants table schema
 * Stores all hackathon registration information (individual team members)
 */
export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  university: varchar('university', { length: 255 }).notNull(),
  specialty: varchar('specialty', { length: 100 }).notNull(),
  year: varchar('year', { length: 10 }).notNull(),
  isTeamLeader: boolean('is_team_leader').notNull().default(false),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Visitors table schema
 * Stores demo day visitor registration information
 */
export const visitors = pgTable('visitors', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  organization: varchar('organization', { length: 255 }).notNull(),
  visitDate: varchar('visit_date', { length: 50 }).notNull(),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert
export type Participant = typeof participants.$inferSelect
export type NewParticipant = typeof participants.$inferInsert
export type Visitor = typeof visitors.$inferSelect
export type NewVisitor = typeof visitors.$inferInsert
