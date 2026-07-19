import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardCategoryTable, gameBoardSectionTable, gameQuestTable } from "$lib/server/db/schema";
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
  const category = await db.query.gameBoardCategoryTable.findFirst({
    where: and(
      eq(gameBoardCategoryTable.id, event.params.categoryId),
      eq(gameBoardCategoryTable.creatorId, user.id)
    ),
    with: {
      section: {
        //@ts-expect-error "where" does not exist on type
        where: eq(gameBoardSectionTable.gameId, event.params.gameId),
      },
    },
  });
  if (!category) error(404);
  const categories = await db.query.gameBoardCategoryTable.findMany({
    where: eq(gameBoardCategoryTable.sectionId, category.sectionId),
    orderBy: asc(gameBoardCategoryTable.createdAt),
  });
  return {category, categories,};
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
    let questId: string;
    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      questId = await db.transaction(async tx => {
        const orderCount = db.$with("order_count").as(
          db.select({value: sql`count(*)`.as("value"),}).from(gameQuestTable)
            .where(eq(gameQuestTable.categoryId, event.params.categoryId!))
        );
        const [quest,] = await tx.with(orderCount).insert(gameQuestTable).values({
          name: data.name,
          description: data.description,
          categoryId: data.category,
          icon: img ? undefined : null,
          order: sql`(select * from ${orderCount})`,
          creatorId: user.id,
        }).returning();
        if (img && quest.icon) await writeFile(quest.icon, await img.png().toBuffer());
        return quest.id;
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${questId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3)),
  category: zfd.text(z.uuidv4()),
  icon: zfd.file(z.instanceof(File).optional()),
});

