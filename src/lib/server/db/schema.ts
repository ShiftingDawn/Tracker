import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", {length: 24,}).notNull().unique(),
  password: text("password").notNull(),
});
export const userRelations = relations(userTable, ({many,}) => ({
  sessions: many(sessionTable),
  games: many(gameTable),
}));
export type User = typeof userTable.$inferSelect;

export const sessionTable = pgTable("session", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => userTable.id),
  expiresAt: timestamp("expires_at", {withTimezone: true, mode: "date",}).notNull(),
});
export const sessionRelations = relations(sessionTable, ({one,}) => ({
  user: one(userTable, {fields: [sessionTable.userId,], references: [userTable.id,],}),
  //
}));
export type Session = typeof sessionTable.$inferSelect;

export const gameTable = pgTable("game", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", {length: 64,}).unique().notNull(),
  icon: uuid().notNull().defaultRandom(),
  creatorId: uuid("creator_id").notNull().references(() => userTable.id),
});
export const gameRelations = relations(gameTable, ({one,}) => ({
  creator: one(userTable, {fields: [gameTable.creatorId,], references: [userTable.id,],}),
  //
}));
export type Game = typeof gameTable.$inferSelect;
