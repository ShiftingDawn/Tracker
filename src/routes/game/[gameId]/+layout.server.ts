import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameTable } from "$lib/server/db/schema";
import { addBreadcrumb } from "$lib/server/util";
import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const game = await db.query.gameTable.findFirst({
    where: eq(gameTable.id, event.params.gameId),
    with: {
      creator: {columns: {username: true,},},
      sections: {
        orderBy: asc(gameBoardSectionTable.order),
        with: {
          creator: {columns: {username: true,},},
          categories: {
            with: {creator: {columns: {username: true,},},},
            orderBy: asc(gameBoardCategoryTable.order),
          },
        },
      },
    },
  });
  if (!game) error(404);
  return await addBreadcrumb({
    game,
    gameCreator: game.creator,
    isGameOwner: game.creatorId === event.locals.user?.id,
  }, event, game.name, `/game/${game.id}`);
};
