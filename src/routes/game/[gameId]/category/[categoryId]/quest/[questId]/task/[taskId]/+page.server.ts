import {requireAuth} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {userQuestTaskCompletionTable} from "$lib/server/db/schema";
import {getError} from "$lib/server/util";
import {fail} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";
import z from "zod";
import {zfd} from "zod-form-data";
import type {Actions, PageServerLoad} from "./$types";
import {toggleTaskComplete, toggleTaskPin} from "$lib/server/taskutils";

export const load: PageServerLoad = async (event) => {
  const completionData = event.locals.user ? await db.query.userQuestTaskCompletionTable.findFirst({
    where: and(
      eq(userQuestTaskCompletionTable.userId, event.locals.user.id),
      eq(userQuestTaskCompletionTable.questTaskId, event.params.taskId)
    ),
  }) : null;
  return {completionData,};
};

export const actions: Actions = {
  togglecompletion: async (event) => {
    const {user,} = requireAuth();
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
      await toggleTaskComplete(user.id, event.params.taskId, data!.completed);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
  togglepin: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = togglePinSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        pinned: getError(errs.properties?.pinned),
      });
    }
    try {
      await toggleTaskPin(user.id, event.params.taskId!, event.params.questId!, data.pinned);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
};

const toggleCompletionSchema = zfd.formData({completed: zfd.checkbox(),});
const togglePinSchema = zfd.formData({pinned: zfd.checkbox(),});
