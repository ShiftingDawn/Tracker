import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable } from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const category = await db.query.gameBoardCategoryTable.findFirst({
    columns: {name: true,},
    where: and(
      eq(gameBoardCategoryTable.id, event.params.categoryId),
      eq(gameBoardCategoryTable.creatorId, user.id)
    ),
    with: {
      section: {
        columns: {gameId: true,},
        //@ts-expect-error "where" does not exist on type
        where: eq(gameBoardSectionTable.gameId, event.params.gameId),
      },
    },
  });
  if (!category) error(404);
  return {category,};
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const category = await db.query.gameBoardCategoryTable.findFirst({
      where: and(
        eq(gameBoardCategoryTable.id, event.params.categoryId!),
        eq(gameBoardCategoryTable.creatorId, user.id)
      ),
      with: {
        section: {
          //@ts-expect-error "where" does not exist on type
          where: eq(gameBoardSectionTable.gameId, event.params.gameId),
        },
      },
    });
    if (!category) error(404);
    try {
      await db.delete(gameBoardCategoryTable).where(eq(gameBoardCategoryTable.id, category.id));
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId}`);
  },
};
