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
  return {game,};
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
        icon: getError(errs.properties?.icon),
      });
    }

    const game = await prisma.game.findFirst({
      where: {
        id: event.params.gameId,
        creatorId: user.id,
      },
    });
    if (!game) error(404);
    try {
      await prisma.game.update({
        data: {
          name: data.name,
          iconId: data?.icon,
        },
        where: {id: game.id,},
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${game.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  icon: zfd.text(z.uuid().optional()),
});
