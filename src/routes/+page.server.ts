import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameTable } from "$lib/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return {user: null,};

  const recentGames = await db.select({
    id: gameTable.id,
    name: gameTable.name,
    icon: gameTable.icon,
    categoryCount: count(gameBoardCategoryTable.id),
  }).from(gameTable)
    .leftJoin(gameBoardCategoryTable, eq(gameBoardCategoryTable.gameId, gameTable.id))
    .groupBy(gameTable.id)
    .orderBy(desc(gameTable.createdAt))
    .limit(5);

  return {user: event.locals.user, recentGames,};
};
