import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameQuestTable, gameTable, userTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const [category,] = await db.select()
    .from(gameBoardCategoryTable)
    .innerJoin(gameBoardSectionTable, eq(gameBoardCategoryTable.sectionId, gameBoardSectionTable.id))
    .innerJoin(gameTable, eq(gameBoardSectionTable.gameId, gameTable.id))
    .innerJoin(userTable, eq(gameBoardCategoryTable.creatorId, userTable.id))
    .where(eq(gameBoardCategoryTable.id, event.params.categoryId))
    .limit(1);
  if (!category) error(404);
  const quests = await db.query.gameQuestTable.findMany({
    where: eq(gameQuestTable.categoryId, category.game_board_category.id),
    orderBy: asc(gameQuestTable.order),
    with: {creator: {columns: {username: true,},},},
  });
  return {
    category: category.game_board_category,
    game: category.game,
    creator: category.user,
    quests,
    isOwner: event.locals.user?.id === category.game_board_category.creatorId,
  };
};
