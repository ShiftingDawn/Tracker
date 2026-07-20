import {requireAuth} from "$lib/server/auth";
import {deleteFile, writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";
import {randomUUID} from "node:crypto";

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  if (!parent.isQuestOwner) error(403);

  const categories = await prisma.gameCategory.findMany({
    where: {sectionId: parent.category.sectionId,},
    orderBy: {createdAt: "asc",},
  });
  return {categories,};
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

    const quest = await prisma.gameQuest.findFirst({
      where: {
        id: event.params.questId,
        creatorId: user.id,
      },
    });
    if (!quest) error(404);

    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      await prisma.$transaction(async tx => {
        const updated = await tx.gameQuest.update({
          where: {id: quest.id,},
          data: {
            name: data.name,
            description: data.description,
            categoryId: data.category,
            icon: img ? randomUUID() : undefined,
          },
        });
        if (img) {
          if (quest.icon) await deleteFile(quest.icon);
          if (updated.icon) await writeFile(updated.icon, await img.png().toBuffer());
        }
      });
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
    return redirect(302, `/game/${event.params.gameId}/category/${data.category}/quest/${quest.id}`);
  },
};

const schema = zfd.formData({
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().min(3)),
  category: zfd.text(z.uuidv4()),
  icon: zfd.file(z.instanceof(File).optional()),
});

