import { requireAuth } from "$lib/server/auth";
import { toggleQuestPin } from "$lib/server/questutils";
import { getError } from "$lib/server/util";
import { fail } from "@sveltejs/kit";
import z from "zod";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";
import { keySectionCollapse, rGetBool } from "$lib/server/db/redis";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const category = (await event.parent()).category;
  const quests = await prisma.gameQuest.findMany({
    where: {categoryId: category.id,},
    orderBy: {order: "asc",},
    include: {
      creator: {select: {username: true,},},
      completed: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take:1,
      } : undefined,
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take:1,
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
