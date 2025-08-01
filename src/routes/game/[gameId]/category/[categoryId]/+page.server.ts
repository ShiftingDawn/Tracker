import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameQuestTable, userQuestCompletionTable, userQuestPinnedTable } from "$lib/server/db/schema";
import { toggleQuestPin } from "$lib/server/questutils";
import { getError } from "$lib/server/util";
import { fail } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import z from "zod";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";
import { keySectionCollapse, rGetBool } from "$lib/server/db/redis";

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
      pinnedQuests: event.locals.user ? {
        where: eq(userQuestPinnedTable.userId, event.locals.user.id),
        limit: 1,
      } : undefined,
    },
  });
  const collapseData = event.locals.user ? {
    pin: await rGetBool(keySectionCollapse(`pnd${category.id}`, event)),
    incomplete: await rGetBool(keySectionCollapse(`inc${category.id}`, event)),
    complete: await rGetBool(keySectionCollapse(`cmp${category.id}`, event)),
  } : undefined;
  return {quests, collapseData,};
};

export const actions: Actions = {
  togglepin: async (event) => {
    const {user, } = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = togglePinSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        quest: getError(errs.properties?.quest),
        pinned: getError(errs.properties?.pinned),
      });
    }
    try {
      await toggleQuestPin(user.id, data.quest, event.params.categoryId!, data.pinned);
    } catch(error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
};
const togglePinSchema = zfd.formData({
  quest: zfd.text(z.uuidv4()),
  pinned: zfd.checkbox(),
});
