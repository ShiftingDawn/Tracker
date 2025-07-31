import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameTable, userTable } from "$lib/server/db/schema";
import { addBreadcrumb } from "$lib/server/util";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const [category,] = await db.select()
    .from(gameBoardCategoryTable)
    .innerJoin(gameBoardSectionTable, eq(gameBoardCategoryTable.sectionId, gameBoardSectionTable.id))
    .innerJoin(gameTable, eq(gameBoardSectionTable.gameId, gameTable.id))
    .innerJoin(userTable, eq(gameBoardCategoryTable.creatorId, userTable.id))
    .where(eq(gameBoardCategoryTable.id, event.params.categoryId))
    .limit(1);
  return await addBreadcrumb(
    {
      category: category.game_board_category,
      categoryCreator: category.user,
      isCategoryOwner: category.game_board_section.creatorId === event.locals.user?.id,
    },
    event,
    category.game_board_category.name,
    `/game/${category.game.id}/category/${category.game_board_category.id}`
  );
};
