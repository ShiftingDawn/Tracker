import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const quest = await prisma.gameQuest.findFirst({
    where: {
      id: event.params.questId,
      creatorId: user.id,
    },
  });
  if (!quest) error(404);
  return {quest,};
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);

    const formData = await event.request.formData();
    const {success, data, error,} = schema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {
        success: false,
        name: getError(errs.properties?.name),
        description: getError(errs.properties?.description),
        icon: getError(errs.properties?.icon),
      });
    }
    let taskId: string;
    try {
      taskId = await prisma.$transaction(async tx => {
        const orderCount = await tx.gameQuestTask.count({where: {questId: event.params.questId,},});
        const task = await tx.gameQuestTask.create({
          data: {
            name: data.name,
            description: data.description || null,
            iconId: data.icon,
            questId: event.params.questId!,
            order: orderCount,
            creatorId: user.id,
          },
        });
        return task.id;
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${event.params.questId}/task/${taskId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3).optional()),
  icon: zfd.file(z.uuid().optional()),
});

