import { db } from "$lib/server/db";
import { desc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { gameTable } from "$lib/server/db/schema";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return {user: null,};

  const recentGames = await db.query.gameTable.findMany({
    columns: {id: true, name: true, icon: true,},
    orderBy: desc(gameTable.createdAt),
    limit: 5,
  });

  return {user: event.locals.user, recentGames,};
};
