import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./usersSchema.js"

export const teams = pgTable('teams', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', {length: 255}).notNull().unique(),
    createdBy: uuid('created_by').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})