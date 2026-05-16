import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	email: varchar("email", { length: 256 }).unique().notNull(),
	hashed_password: varchar("hashed_password").notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	body: varchar("body", { length: 140 }).notNull(),
	userId: uuid("userId").references(() => users.id, { onDelete: 'cascade' }).notNull()
});

export type NewChirp = typeof chirps.$inferInsert;

export const refresh_tokens = pgTable("refresh_tokens", {
	token: varchar("token").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
	userId: uuid("userId").references(() => users.id, { onDelete: 'cascade' }).notNull(),
	expires_at: timestamp("expires_at").notNull(),
	revoked_at: timestamp("revoked_at")
	
});