import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isQuestOwner) error(403);

  const quest = await prisma.gameQuest.findFirst({
    where: {id: event.params.questId,},
    include: {
      creator: true,
      icon: {select: {id: true, fileName: true,},},
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
    },
  });
  if (!quest) return error(404);

  const categories = await prisma.gameCategory.findMany({
    where: {sectionId: parent.category.sectionId,},
    orderBy: {createdAt: "asc",},
  });
  return {quest, categories,};
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);

    const formData = await event.request.formData();
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

    const quest = await prisma.gameQuest.findFirst({
      where: {
        id: event.params.questId,
        creatorId: user.id,
      },
    });
    if (!quest) error(404);

    try {
      await prisma.gameQuest.update({
        where: {id: quest.id,},
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.category,
          iconId: data.icon,
        },
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${data.category}/quest/${quest.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3)),
  category: zfd.text(z.uuidv4()),
  icon: zfd.text(z.uuid().optional()),
});

