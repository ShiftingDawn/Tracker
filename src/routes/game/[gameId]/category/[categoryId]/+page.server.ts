import { db } from "$lib/server/db";
import { gameBoardCategoryTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const category = await db.query.gameBoardCategoryTable.findFirst({
    where: and(eq(gameBoardCategoryTable.id, event.params.categoryId), eq(gameBoardCategoryTable.gameId, event.params.gameId)),
    with: {creator: {columns: {username: true,},}, game: true,},
  });
  if (!category) error(404);
  return {
    category,
    game: category.game,
    isOwner: event.locals.user?.id === category.creatorId,
  };
};
