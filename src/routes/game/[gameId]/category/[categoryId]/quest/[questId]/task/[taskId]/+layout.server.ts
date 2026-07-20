import {addBreadcrumb} from "$lib/server/util";
import {error} from "@sveltejs/kit";
import type {LayoutServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: LayoutServerLoad = async (event) => {
  const {gameId, categoryId, questId, taskId,} = event.params;
  const task = await prisma.gameQuestTask.findFirst({
    where: {id: taskId,},
    include: {
      creator: true,
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
    },
  });
  if (!task) return error(404);
  return await addBreadcrumb(
    {
      task: task,
      taskCreator: task.creator,
      isTaskOwner: task.creatorId === event.locals.user?.id,
    },
    event,
    task.name,
    `/game/${gameId}/category/${categoryId}/quest/${questId}/task/${taskId}`
  );
};
