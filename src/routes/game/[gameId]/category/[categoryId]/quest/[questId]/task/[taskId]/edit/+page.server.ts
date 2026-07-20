import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isTaskOwner) error(403);

  const task = await prisma.gameQuestTask.findFirst({
    where: {id: event.params.taskId,},
    include: {
      creator: true,
      icon: {select: {id: true, fileName: true,},},
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
    },
  });
  if (!task) return error(404);

  return {task,};
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const formData = await event.request.formData();
    console.log(formData);
    const {success, data, error: parseError,} = schema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        name: getError(errs.properties?.name),
        description: getError(errs.properties?.description),
        icon: getError(errs.properties?.icon),
      });
    }

    const task = await prisma.gameQuestTask.findFirst({
      where: {
        id: event.params.taskId,
        creatorId: user.id,
      },
    });
    if (!task) error(404);

    try {
      await prisma.gameQuestTask.update({
        data: {
          name: data.name,
          description: data.description,
          iconId: data.icon ?? null,
        },
        where: {id: task.id,},
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${event.params.questId}/task/${task.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3).optional()),
  icon: zfd.text(z.uuid().optional()),
});

