import {requireAuth} from "$lib/server/auth";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isQuestOwner) error(403);
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const quest = await prisma.gameQuest.findFirst({
      where: {
        id: event.params.questId,
        creatorId: user.id,
      },
    });
    if (!quest) error(404);
    try {
      await prisma.gameQuest.delete({where: {id: quest.id,},});
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}`);
  },
};
