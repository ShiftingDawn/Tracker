import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameTable } from "$lib/server/db/schema";
import { writeFile } from "$lib/server/fileservices";
import { getError, getScaledSizes } from "$lib/server/util";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, asc, eq, sql } from "drizzle-orm";
import sharp from "sharp";
import z from "zod";
import { zfd } from "zod-form-data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const game = await db.query.gameTable.findFirst({where: and(eq(gameTable.id, event.params.gameId), eq(gameTable.creatorId, user.id)),});
  if (!game) error(404);
  const sections = await db.query.gameBoardSectionTable.findMany({
    where: eq(gameBoardSectionTable.gameId, event.params.gameId),
    orderBy: asc(gameBoardSectionTable.order),
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
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      categoryId = await db.transaction(async tx => {
        const orderCount = db.$with("order_count").as(
          db.select({value: sql`count(*)`.as("value"),}).from(gameBoardCategoryTable)
            .where(eq(gameBoardCategoryTable.sectionId, data.section!))
        );
        const [category,] = await tx.with(orderCount).insert(gameBoardCategoryTable).values({
          name: data.name,
          description: data.description || null,
          sectionId: data.section,
          icon: img ? undefined : null,
          order: sql`(select * from ${orderCount})`,
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
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().max(255).optional()),
  section: zfd.text(z.uuidv4()),
  icon: zfd.file(z.instanceof(File).optional()),
});

