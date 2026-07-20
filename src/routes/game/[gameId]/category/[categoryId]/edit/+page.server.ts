import {requireAuth} from "$lib/server/auth";
import {prisma} from "$lib/server/db";
import {getError} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const category = await prisma.gameCategory.findFirst({
    where: {
      id: event.params.categoryId,
      creatorId: user.id,
    },
    include: {
      section: true,
      icon: {
        select: {
          id: true,
          fileName: true,
        },
      },
    },
  });
  if (!category) error(404);
  const sections = await prisma.gameSection.findMany({
    where: {gameId: event.params.gameId,},
    orderBy: {order: "asc",},
  });
  return {category, sections,};
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
    const category = await prisma.gameCategory.findFirst({
      where: {
        id: event.params.categoryId,
        creatorId: user.id,
      },
      include: {section: true,},
    });

    if (!category) error(404);
    try {
      await prisma.gameCategory.update({
        data: {
          name: data.name,
          description: data.description || null,
          sectionId: data.section,
          iconId: data.icon ?? null,
        },
        where: {id: category.id,},
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${category.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().max(255).optional()),
  section: zfd.text(z.uuidv4()),
  icon: zfd.text(z.uuid().optional()),
});

