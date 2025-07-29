import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const game = await db.query.gameTable.findFirst({
    where: eq(gameTable.id, event.params.gameId),
    with: {
      creator: {columns: {username: true,},},
      categories: {
        with: {creator: {columns: {username: true,},},},
        orderBy: asc(gameBoardCategoryTable.createdAt),
      },
    },
  });
  if (!game) error(404);
  return {
    game,
    isOwner: event.locals.user?.id === game.creatorId,
  };
};
