import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardCategoryTable } from "$lib/server/db/schema";
import { deleteFile, writeFile } from "$lib/server/fileservices";
import { getError, getScaledSizes } from "$lib/server/util";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
import sharp from "sharp";
import z from "zod";
import { zfd } from "zod-form-data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const category = await db.query.gameBoardCategoryTable.findFirst({
    where: and(
      eq(gameBoardCategoryTable.id, event.params.categoryId),
      eq(gameBoardCategoryTable.gameId, event.params.gameId),
      eq(gameBoardCategoryTable.creatorId, user.id)
    ),
  });
  if (!category) error(404);
  return {category,};
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

    const category = await db.query.gameBoardCategoryTable.findFirst({
      where: and(
        eq(gameBoardCategoryTable.id, event.params.categoryId!),
        eq(gameBoardCategoryTable.gameId, event.params.gameId!),
        eq(gameBoardCategoryTable.creatorId, user.id)
      ),
    });
    if (!category) error(404);
    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      const [updated,] = await db.update(gameBoardCategoryTable).set({
        name: data.name,
        description: data.description || null,
        icon: img ? sql`gen_random_uuid()` : undefined,
      }).where(eq(gameBoardCategoryTable.id, category.id)).returning();
      if (img) {
        if (category.icon) await deleteFile(category.icon);
        if (updated.icon) await writeFile(updated.icon, await img.png().toBuffer());
      }
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${category.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().min(3).max(64)),
  description: zfd.text(z.string().max(255).optional()),
  icon: zfd.file(z.instanceof(File).optional()),
});

