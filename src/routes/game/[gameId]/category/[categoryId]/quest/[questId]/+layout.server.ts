import {addBreadcrumb} from "$lib/server/util";
import {error} from "@sveltejs/kit";
import type {LayoutServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: LayoutServerLoad = async (event) => {
  const {gameId, categoryId, questId,} = event.params;
  const quest = await prisma.gameQuest.findFirst({
    where: {id: questId,},
    include: {
      creator: true,
      icon: true,
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
    },
  });
  if (!quest) return error(404);
  return await addBreadcrumb(
    {
      quest: quest,
      questCreator: quest.creator,
      isQuestOwner: quest.creatorId === event.locals.user?.id,
    },
    event,
    quest.name,
    `/game/${gameId}/category/${categoryId}/quest/${questId}`
  );
};
