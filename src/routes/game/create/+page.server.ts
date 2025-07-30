import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameTable } from "$lib/server/db/schema";
import { writeFile } from "$lib/server/fileservices";
import { getError, getScaledSizes, isImage } from "$lib/server/util";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import sharp from "sharp";
import z from "zod";
import { zfd } from "zod-form-data";
import type { PageServerLoad } from "./$types";

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
    if (!isImage(data.icon)) {
      return fail(400, {
        success: false,
        icon: "Not an image",
      });
    }
    let gameId: string;
    try {
      let img = sharp(await data.icon.bytes());
      img = img.resize(await getScaledSizes(128, img));
      gameId = await db.transaction(async tx => {
        const [game,] = await tx.insert(gameTable).values({
          name: data.name,
          creatorId: user.id,
        }).returning();
        await writeFile(game.icon, await img.png().toBuffer());
        return game.id;
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${gameId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().min(3).max(64)),
  icon: zfd.file(),
});
