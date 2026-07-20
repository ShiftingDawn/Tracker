import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const game = await prisma.game.findFirst({
    where: {
      id: event.params.gameId,
      creatorId: user.id,
    },
  });
  if (!game) error(404);
  const sections = await prisma.gameSection.findMany({
    where: {gameId: game.id,},
    orderBy: {order: "asc",},
  });
  return {game, sections,};
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
    let categoryId: string;
    try {
      categoryId = await prisma.$transaction(async tx => {
        const orderCount = await tx.gameCategory.count({where: {sectionId: data.section,},});
        const category = await tx.gameCategory.create({
          data: {
            name: data.name,
            description: data.description || null,
            sectionId: data.section,
            iconId: data?.icon,
            order: orderCount,
            creatorId: user.id,
          },
        });
        return category.id;
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${categoryId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().max(255).optional()),
  section: zfd.text(z.uuidv4()),
  icon: zfd.text(z.uuid().optional()),
});

