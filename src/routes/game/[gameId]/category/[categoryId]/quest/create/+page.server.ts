import {requireAuth} from "$lib/server/auth";
import {writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);
  const category = await prisma.gameCategory.findFirst({
    where: {
      id: event.params.categoryId,
      creatorId: user.id,
    },
    include: {section: true,},
  });
  if (!category) error(404);
  const categories = await prisma.gameCategory.findMany({
    where: {sectionId: category.sectionId,},
    orderBy: {createdAt: "asc",},
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
      questId = await prisma.$transaction(async tx => {
        const orderCount = await tx.gameQuest.count({where: {categoryId: event.params.categoryId,},});
        const quest = await tx.gameQuest.create({
          data: {
            name: data.name,
            description: data.description,
            categoryId: data.category,
            icon: img ? undefined : null,
            order: orderCount,
            creatorId: user.id,
          },
        });
        if (img && quest.icon) {
          await writeFile(quest.icon, await img.png().toBuffer());
        }
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

