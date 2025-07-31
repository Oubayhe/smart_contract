import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teamsSchema.js";
import { users } from "./usersSchema.js";

export const teamMembers = pgTable('team_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    teamId: uuid('team_id').notNull().references(() => teams.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    joinedAt: timestamp('joined_at').defaultNow()
})