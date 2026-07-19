import {requireAuth} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {gameQuestTaskTable} from "$lib/server/db/schema";
import {deleteFile, writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import {and, eq, sql} from "drizzle-orm";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isTaskOwner) error(403);
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

    const task = await db.query.gameQuestTaskTable.findFirst({
      where: and(
        eq(gameQuestTaskTable.id, event.params.taskId!),
        eq(gameQuestTaskTable.creatorId, user.id)
      ),
    });
    if (!task) error(404);

    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      await db.transaction(async tx => {
        const [updated,] = await tx.update(gameQuestTaskTable).set({
          name: data.name,
          description: data.description,
          icon: img ? sql`gen_random_uuid()` : undefined,
        }).where(eq(gameQuestTaskTable.id, task.id)).returning();
        if (img) {
          if (task.icon) await deleteFile(task.icon);
          if (updated.icon) await writeFile(updated.icon, await img.png().toBuffer());
        }
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${event.params.categoryId}/quest/${event.params.questId}/task/${task.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().min(3).max(64)),
  description: zfd.text(z.string().min(3)),
  icon: zfd.file(z.instanceof(File).optional()),
});

