import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameTable } from "$lib/server/db/schema";
import { writeFile } from "$lib/server/fileservices";
import { getError, getScaledSizes } from "$lib/server/util";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
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
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      categoryId = await db.transaction(async tx => {
        const [category,] = await tx.insert(gameBoardCategoryTable).values({
          name: data.name,
          description: data.description || null,
          gameId: event.params.gameId!,
          icon: img ? undefined : null,
          creatorId: user.id,
        }).returning();
        if (img && category.icon) await writeFile(category.icon, await img.png().toBuffer());
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
  name: zfd.text(z.string().min(3).max(64)),
  description: zfd.text(z.string().max(255).optional()),
  icon: zfd.file(z.instanceof(File).optional()),
});

