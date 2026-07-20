import {requireAuth} from "$lib/server/auth";
import {deleteFile, writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes, isImage} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";
import {randomUUID} from "node:crypto";

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
    if (data.icon !== undefined && !isImage(data.icon)) {
      return fail(400, {
        success: false,
        icon: "Not an image",
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
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      const updated = await prisma.game.update({
        data: {
          name: data.name,
          icon: img ? randomUUID() : undefined,
        },
        where: {id: game.id,},
      });
      if (img) {
        await deleteFile(game.icon);
        await writeFile(updated.icon, await img.png().toBuffer());
      }
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${game.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  icon: zfd.file(z.instanceof(File).optional()),
});
