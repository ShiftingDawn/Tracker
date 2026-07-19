import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameTable } from "$lib/server/db/schema";
import { writeFile, deleteFile } from "$lib/server/fileservices";
import { getError, getScaledSizes, isImage } from "$lib/server/util";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
import sharp from "sharp";
import z from "zod";
import { zfd } from "zod-form-data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const game = await db.query.gameTable.findFirst({where: and(eq(gameTable.id, event.params.gameId), eq(gameTable.creatorId, user.id)),});
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

    const game = await db.query.gameTable.findFirst({
      where: and(
        eq(gameTable.id, event.params.gameId!),
        eq(gameTable.creatorId, user.id)),
    });
    if (!game) error(404);
    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      const [updated,] = await db.update(gameTable).set({
        name: data.name,
        icon: img ? sql`gen_random_uuid()` : undefined,
      }).where(eq(gameTable.id, game.id)).returning();
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
