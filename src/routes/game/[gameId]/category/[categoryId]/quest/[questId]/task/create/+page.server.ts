import {requireAuth} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {gameQuestTable, gameQuestTaskTable} from "$lib/server/db/schema";
import {writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import {and, eq, sql} from "drizzle-orm";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const quest = await db.query.gameQuestTable.findFirst({
    where: and(
      eq(gameQuestTable.id, event.params.questId),
      eq(gameQuestTable.creatorId, user.id)
    ),
  });
  if (!quest) error(404);
  return {quest,};
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
    let taskId: string;
    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      taskId = await db.transaction(async tx => {
        const orderCount = db.$with("order_count").as(
          db.select({value: sql`count(*)`.as("value"),}).from(gameQuestTaskTable)
            .where(eq(gameQuestTaskTable.questId, event.params.questId!))
        );
        const [task,] = await tx.with(orderCount).insert(gameQuestTaskTable).values({
          name: data.name,
          description: data.description || null,
          icon: img ? undefined : null,
          questId: event.params.questId!,
          order: sql`(select * from ${orderCount})`,
          creatorId: user.id,
        }).returning();
        if (img && task.icon) await writeFile(task.icon, await img.png().toBuffer());
        return task.id;
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${event.params.questId}/task/${taskId}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3).optional()),
  icon: zfd.file(z.instanceof(File).optional()),
});

