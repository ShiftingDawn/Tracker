import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameTable } from "$lib/server/db/schema";
import { countDistinct, desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return {user: null,};

  const recentGames = await db.select({
    id: gameTable.id,
    name: gameTable.name,
    icon: gameTable.icon,
    sectionCount: countDistinct(gameBoardSectionTable.id),
    categoryCount: countDistinct(gameBoardCategoryTable.id),
  }).from(gameTable)
    .leftJoin(gameBoardSectionTable, eq(gameBoardSectionTable.gameId, gameTable.id))
    .leftJoin(gameBoardCategoryTable, eq(gameBoardCategoryTable.sectionId, gameBoardSectionTable.id))
    .groupBy(gameTable.id)
    .orderBy(desc(gameTable.createdAt))
    .limit(5);

  return {user: event.locals.user, recentGames,};
};
