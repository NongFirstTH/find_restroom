import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  customType,
  time,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const geometry = customType<{ data: string }>({
  dataType() {
    return "geometry(Point, 32647)";
  },
});

// User table
export const usersTable = pgTable("users", {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Refresh tokens table
export const refreshTokensTable = pgTable("refresh_tokens", {
  tokenId: uuid("token_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.userId, { onDelete: "cascade" })
    .notNull(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Restroom table
export const restroomsTable = pgTable("restrooms", {
  restroomId: uuid('restroom_id').primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  detail: text("detail"),
  address: text("address"),
  openingHours: time("opening_hours"),
  closingHours: time("closing_hours"),
  type: varchar("type", { length: 50 }).notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  location: geometry("location").notNull(),
  createdBy: uuid("created_by")
    .references(() => usersTable.userId, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  restrooms: many(restroomsTable),
  refreshTokens: many(refreshTokensTable),
}));

export const restroomsRelations = relations(restroomsTable, ({ one }) => ({
  createdBy: one(usersTable, {
    fields: [restroomsTable.createdBy],
    references: [usersTable.userId],
  }),
}));

export const refreshTokensRelations = relations(refreshTokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [refreshTokensTable.userId],
    references: [usersTable.userId],
  }),
}));

