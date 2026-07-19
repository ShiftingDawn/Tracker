import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { keySectionCollapse, rGetBool } from "$lib/server/db/redis";
import {
  gameBoardCategoryTable,
  gameBoardSectionTable,
  gameQuestTable,
  gameQuestTaskTable,
  gameTable
} from "$lib/server/db/schema";
import { and, countDistinct, desc, eq, not } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);

  const collapseData = {
    ownGames: await rGetBool(keySectionCollapse("profile.owngames", user)),
    contribCategories: await rGetBool(keySectionCollapse("profile.contribcategories", user)),
    contribQuests: await rGetBool(keySectionCollapse("profile.contribquests", user)),
    contribTasks: await rGetBool(keySectionCollapse("profile.contribtasks", user)),
  };

  const games = await db.select({
    id: gameTable.id,
    name: gameTable.name,
    icon: gameTable.icon,
    sectionCount: countDistinct(gameBoardSectionTable.id),
    categoryCount: countDistinct(gameBoardCategoryTable.id),
  }).from(gameTable)
    .leftJoin(gameBoardSectionTable, eq(gameBoardSectionTable.gameId, gameTable.id))
    .leftJoin(gameBoardCategoryTable, eq(gameBoardCategoryTable.sectionId, gameBoardSectionTable.id))
    .groupBy(gameTable.id)
    .where(eq(gameTable.creatorId, user.id))
    .orderBy(desc(gameTable.createdAt));

  const contribCategories = await db.select({
    id: gameBoardCategoryTable.id,
    name: gameBoardCategoryTable.name,
    icon: gameBoardCategoryTable.icon,
    gameId: gameTable.id,
    gameName: gameTable.name,
    questCount: countDistinct(gameQuestTable.id),
  }).from(gameBoardCategoryTable)
    .innerJoin(gameBoardSectionTable, eq(gameBoardCategoryTable.sectionId, gameBoardSectionTable.id))
    .innerJoin(gameTable, eq(gameBoardSectionTable.gameId, gameTable.id))
    .innerJoin(gameQuestTable, eq(gameQuestTable.categoryId, gameBoardCategoryTable.id))
    .groupBy(gameTable.id, gameBoardCategoryTable.id)
    .where(and(
      eq(gameBoardCategoryTable.creatorId, user.id),
      not(eq(gameTable.creatorId, user.id))
    ))
    .orderBy(desc(gameBoardCategoryTable.createdAt));

  const contribQuests = await db.select({
    id: gameQuestTable.id,
    name: gameQuestTable.name,
    icon: gameQuestTable.icon,
    gameId: gameTable.id,
    gameName: gameTable.name,
    categoryId: gameBoardCategoryTable.id,
    categoryName: gameBoardCategoryTable.name,
  }).from(gameQuestTable)
    .innerJoin(gameBoardCategoryTable, eq(gameBoardCategoryTable.id, gameQuestTable.categoryId))
    .innerJoin(gameBoardSectionTable, eq(gameBoardSectionTable.id, gameBoardCategoryTable.sectionId))
    .innerJoin(gameTable, eq(gameTable.id, gameBoardSectionTable.gameId))
    .groupBy(gameTable.id, gameBoardCategoryTable.id, gameQuestTable.id)
    .where(and(
      eq(gameQuestTable.creatorId, user.id),
      not(eq(gameTable.creatorId, user.id)),
      not(eq(gameBoardCategoryTable.creatorId, user.id))
    ))
    .orderBy(desc(gameQuestTable.createdAt));

  const contribTasks = await db.select({
    id: gameQuestTaskTable.id,
    name: gameQuestTaskTable.name,
    icon: gameQuestTaskTable.icon,
    gameId: gameTable.id,
    gameName: gameTable.name,
    categoryId: gameBoardCategoryTable.id,
    categoryName: gameBoardCategoryTable.name,
    questId: gameQuestTable.id,
    questName: gameQuestTable.name,
  }).from(gameQuestTaskTable)
    .innerJoin(gameQuestTable, eq(gameQuestTable.id, gameQuestTaskTable.questId))
    .innerJoin(gameBoardCategoryTable, eq(gameBoardCategoryTable.id, gameQuestTable.categoryId))
    .innerJoin(gameBoardSectionTable, eq(gameBoardSectionTable.id, gameBoardCategoryTable.sectionId))
    .innerJoin(gameTable, eq(gameTable.id, gameBoardSectionTable.gameId))
    .groupBy(gameQuestTaskTable.id, gameTable.id, gameBoardCategoryTable.id, gameQuestTable.id)
    .where(and(
      eq(gameQuestTable.creatorId, user.id),
      not(eq(gameTable.creatorId, user.id)),
      not(eq(gameBoardCategoryTable.creatorId, user.id))
    ))
    .orderBy(desc(gameQuestTable.createdAt));

  return {
    collapseData,
    games,
    contribCategories,
    contribQuests,
    contribTasks,
  };
};
