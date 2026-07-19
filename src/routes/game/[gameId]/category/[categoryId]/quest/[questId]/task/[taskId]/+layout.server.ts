import {db} from "$lib/server/db";
import {gameQuestTaskTable, userQuestTaskPinnedTable} from "$lib/server/db/schema";
import {addBreadcrumb} from "$lib/server/util";
import {error} from "@sveltejs/kit";
import {eq} from "drizzle-orm";
import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const {gameId, categoryId, questId, taskId,} = event.params;
  const task = await db.query.gameQuestTaskTable.findFirst({
    where: eq(gameQuestTaskTable.id, taskId),
    with: {
      creator: true,
      pinnedTasks: event.locals.user ? {
        where: eq(userQuestTaskPinnedTable.userId, event.locals.user.id),
        limit: 1,
      } : undefined,
    },
  });
  if (!task) error(404);
  return await addBreadcrumb(
    {
      task,
      taskCreator: task.creator,
      isTaskOwner: task.creatorId === event.locals.user?.id,
    },
    event,
    task.name,
    `/game/${gameId}/category/${categoryId}/quest/${questId}/task/${taskId}`
  );
};
