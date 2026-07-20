import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {type Actions, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  requireAuth(event);
  return {};
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
        icon: getError(errs.properties?.icon),
      });
    }
    let gameId;
    try {
      const game = await prisma.game.create({
        data: {
          name: data.name,
          creatorId: user.id,
          iconId: data.icon,
        },
      });
      gameId = game.id;
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${gameId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  icon: zfd.text(z.uuid()),
});
