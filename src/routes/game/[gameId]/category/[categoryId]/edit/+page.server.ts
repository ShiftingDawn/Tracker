import {requireAuth} from "$lib/server/auth";
import {prisma} from "$lib/server/db";
import {deleteFile, writeFile} from "$lib/server/fileservices";
import {getError, getScaledSizes} from "$lib/server/util";
import {type Actions, error, fail, redirect} from "@sveltejs/kit";
import sharp from "sharp";
import z from "zod";
import {zfd} from "zod-form-data";
import type {PageServerLoad} from "./$types";
import {randomUUID} from "node:crypto";

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
  const sections = await prisma.gameSection.findMany({
    where: {gameId: event.params.gameId,},
    orderBy: {order: "asc",},
  });
  return {category, sections,};
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
    const category = await prisma.gameCategory.findFirst({
      where: {
        id: event.params.categoryId,
        creatorId: user.id,
      },
      include: {section: true,},
    });

    if (!category) error(404);
    try {
      let img = data.icon ? sharp(await data.icon.bytes()) : undefined;
      if (img) img = img.resize(await getScaledSizes(128, img));
      const updated = await prisma.gameCategory.update({
        data: {
          name: data.name,
          description: data.description || null,
          sectionId: data.section,
          icon: img ? randomUUID() : undefined,
        },
        where: {id: category.id,},
      });
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
  name: zfd.text(z.string().trim().min(3).max(64)),
  description: zfd.text(z.string().trim().max(255).optional()),
  section: zfd.text(z.uuidv4()),
  icon: zfd.file(z.instanceof(File).optional()),
});

