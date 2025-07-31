import { db } from "$lib/server/db";
import { gameQuestTable } from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const category = (await event.parent()).category;
  const quests = await db.query.gameQuestTable.findMany({
    where: eq(gameQuestTable.categoryId, category.id),
    orderBy: asc(gameQuestTable.order),
    with: {creator: {columns: {username: true,},},},
  });
  return {quests,};
};
