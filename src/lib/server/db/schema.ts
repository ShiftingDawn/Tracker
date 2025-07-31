import { relations } from "drizzle-orm";
import { pgTable, smallint, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("created_at", {withTimezone: true, mode: "date",}).notNull().defaultNow(),
});
export const gameRelations = relations(gameTable, ({one, many,}) => ({
  creator: one(userTable, {fields: [gameTable.creatorId,], references: [userTable.id,],}),
  sections: many(gameBoardSectionTable),
}));
export type Game = typeof gameTable.$inferSelect;

export const gameBoardSectionTable = pgTable("game_board_section", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", {length: 64,}).notNull(),
  order: smallint("order").notNull(),
  gameId: uuid("game_id").notNull().references(() => gameTable.id),
  creatorId: uuid("creator_id").notNull().references(() => userTable.id),
  createdAt: timestamp("created_at", {withTimezone: true, mode: "date",}).notNull().defaultNow(),
}, table => [
  uniqueIndex("unique_name_game_id").on(table.name, table.gameId),
  //
]);
export const gameBoardSectionRelations = relations(gameBoardSectionTable, ({one, many,}) => ({
  creator: one(userTable, {fields: [gameBoardSectionTable.creatorId,], references: [userTable.id,],}),
  game: one(gameTable, {fields: [gameBoardSectionTable.gameId,], references: [gameTable.id,],}),
  categories: many(gameBoardCategoryTable),
}));
export type GameBoardSection = typeof gameBoardSectionTable.$inferSelect;

export const gameBoardCategoryTable = pgTable("game_board_category", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", {length: 64,}).notNull(),
  description: varchar("description", {length: 255,}),
  icon: uuid().defaultRandom(),
  order: smallint("order").notNull(),
  sectionId: uuid("section_id").notNull().references(() => gameBoardSectionTable.id),
  creatorId: uuid("creator_id").notNull().references(() => userTable.id),
  createdAt: timestamp("created_at", {withTimezone: true, mode: "date",}).notNull().defaultNow(),
}, table => [
  uniqueIndex("unique_name_section_id").on(table.name, table.sectionId),
  //
]);
export const gameBoardCategoryRelations = relations(gameBoardCategoryTable, ({one,}) => ({
  section: one(gameBoardSectionTable, {fields: [gameBoardCategoryTable.sectionId,], references: [gameBoardSectionTable.id,],}),
  creator: one(userTable, {fields: [gameBoardCategoryTable.creatorId,], references: [userTable.id,],}),
}));
export type GameBoardCategory = typeof gameBoardCategoryTable.$inferSelect;

export const gameQuestTable = pgTable("game_quest", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", {length: 64,}).notNull(),
  description: text("description").notNull(),
  icon: uuid().defaultRandom(),
  order: smallint("order").notNull(),
  categoryId: uuid("category_id").notNull().references(() => gameBoardCategoryTable.id),
  creatorId: uuid("creator_id").notNull().references(() => userTable.id),
  createdAt: timestamp("created_at", {withTimezone: true, mode: "date",}).notNull().defaultNow(),
}, table => [
  uniqueIndex("unique_name_category_id").on(table.name, table.categoryId),
  //
]);
export const gameQuestRelations = relations(gameQuestTable, ({one,}) => ({
  category: one(gameBoardCategoryTable, {fields: [gameQuestTable.categoryId,], references: [gameBoardCategoryTable.id,],}),
  creator: one(userTable, {fields: [gameQuestTable.creatorId,], references: [userTable.id,],}),
}));
export type GameQuest = typeof gameQuestTable.$inferSelect;
