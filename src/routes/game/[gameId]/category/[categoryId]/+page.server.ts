import { db } from "$lib/server/db";
import { gameQuestTable, userQuestCompletionTable } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const category = (await event.parent()).category;
  const quests = await db.query.gameQuestTable.findMany({
    where: eq(gameQuestTable.categoryId, category.id),
    orderBy: asc(gameQuestTable.order),
    with: {
      creator: {columns: {username: true,},},
      completedQuests: event.locals.user ? {
        where: eq(userQuestCompletionTable.userId, event.locals.user.id),
        limit: 1,
      } : undefined,
    },
  });
  return {quests,};
};
