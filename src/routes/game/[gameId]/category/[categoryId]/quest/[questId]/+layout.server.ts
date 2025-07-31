import { db } from "$lib/server/db";
import { gameQuestTable } from "$lib/server/db/schema";
import { addBreadcrumb } from "$lib/server/util";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const{ gameId, categoryId, questId,} = event.params;
  const quest = await db.query.gameQuestTable.findFirst({
    where: eq(gameQuestTable.id, questId),
    with: {creator: true,},
  });
  if (!quest) error(404);
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
