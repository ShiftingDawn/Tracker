import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardSectionTable, gameQuestTable } from "$lib/server/db/schema";
import { getError } from "$lib/server/util";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, asc, eq } from "drizzle-orm";
import z from "zod";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user, } = requireAuth();
  const category = await db.query.gameBoardCategoryTable.findFirst({
    where: and(
      eq(gameBoardSectionTable.id, event.params.categoryId),
      eq(gameBoardSectionTable.creatorId, user.id)
    ),
    with: {quests: {orderBy: asc(gameQuestTable.order),},},
  });
  if (!category) error(404);
  return {category,};
};

export const actions: Actions = {
  default: async (event) => {
    requireAuth();
    const formData = await event.request.formData();
    const {success, data, error, } = saveSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.order),});
    }
    try {
      await db.transaction(async tx => {
        for (let i = 0; i < data.order.length; ++i) {
          await tx.update(gameQuestTable).set({order: i,})
            .where(eq(gameQuestTable.id, data.order[i]));
        }
      });
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId!}/category/${event.params.categoryId!}`);
  },
};

const saveSchema = zfd.formData({order: zfd.repeatableOfType(zfd.text(z.uuidv4())),});
