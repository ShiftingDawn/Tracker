import {requireAuth} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {gameQuestTaskTable} from "$lib/server/db/schema";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isQuestOwner) error(403);
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const task = await db.query.gameQuestTaskTable.findFirst({
      where: and(
        eq(gameQuestTaskTable.id, event.params.taskId!),
        eq(gameQuestTaskTable.creatorId, user.id)
      ),
    });
    if (!task) error(404);
    try {
      await db.delete(gameQuestTaskTable).where(eq(gameQuestTaskTable.id, task.id));
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${event.params.questId}`);
  },
};
