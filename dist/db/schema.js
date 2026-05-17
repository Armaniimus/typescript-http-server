import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashed_password: varchar("hashed_password").notNull().default("unset"),
    is_chirpy_red: boolean("is_chirpy_red").default(false),
});
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
export const refresh_tokens = pgTable("refresh_tokens", {
    token: varchar("token").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid("userId").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    expires_at: timestamp("expires_at").notNull().default(new Date(Date.now() + 3600 * 24 * 60 * 1000)),
    revoked_at: timestamp("revoked_at")
});
