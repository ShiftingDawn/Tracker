import { db } from "$lib/server/db";
import { userQuestCompletionTable } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";
import z from "zod";
import { fail } from "@sveltejs/kit";
import { getError } from "$lib/server/util";
import { requireAuth } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;
  const completionData = user ? await db.query.userQuestCompletionTable.findFirst({
    where: and(
      eq(userQuestCompletionTable.userId, user.id),
      eq(userQuestCompletionTable.questId, event.params.questId)
    ),
  }) : null;
  return {completionData,};
};

export const actions: Actions = {
  togglecompletion: async (event) => {
    const {user, } = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = toggleCompletionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        completed: getError(errs.properties?.completed),
      });
    }
    try {
      const completed = await db.query.userQuestCompletionTable.findFirst({
        where: and(
          eq(userQuestCompletionTable.userId, user.id),
          eq(userQuestCompletionTable.questId, event.params.questId)
        ),
      });
      if (Boolean(completed) === data.completed) return fail(400);
      if (completed) {
        await db.delete(userQuestCompletionTable).where(and(
          eq(userQuestCompletionTable.userId, user.id),
          eq(userQuestCompletionTable.questId, event.params.questId)
        ));
      } else {
        await db.insert(userQuestCompletionTable).values({
          userId: user.id,
          questId: event.params.questId,
        });
      }
    } catch(error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
};

const toggleCompletionSchema = zfd.formData({completed: zfd.checkbox(),});
