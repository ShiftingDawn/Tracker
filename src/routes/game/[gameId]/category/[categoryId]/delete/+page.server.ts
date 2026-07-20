import {requireAuth} from "$lib/server/auth";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const category = await prisma.gameCategory.findFirst({
    select: {
      name: true,
      section: {select: {gameId: true,},},
    },
    where: {
      id: event.params.categoryId,
      creatorId: user.id,
    },
  });
  if (!category) error(404);
  return {category,};
};

export const actions: Actions = {
  default: async (event) => {
    const {user,} = requireAuth(event);
    const category = await prisma.gameCategory.findFirst({
      where: {
        id: event.params.categoryId,
        creatorId: user.id,
      },
    });
    if (!category) error(404);
    try {
      await prisma.gameCategory.delete({where: {id: category.id,},});
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId}`);
  },
};
