import { boolean, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./usersSchema.js";

export const packages = pgTable('packages', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    abi: json('abi'),
    bytecode: text('bytecode'),
    isPublic: boolean('is_public').default(false),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });