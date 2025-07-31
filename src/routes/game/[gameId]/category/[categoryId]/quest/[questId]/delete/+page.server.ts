import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameQuestTable } from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isQuestOwner) error(403);
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const quest = await db.query.gameQuestTable.findFirst({
      where: and(
        eq(gameQuestTable.id, event.params.questId!),
        eq(gameQuestTable.creatorId, user.id)
      ),
    });
    if (!quest) error(404);
    try {
      await db.delete(gameQuestTable).where(eq(gameQuestTable.id, quest.id));
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}`);
  },
};
