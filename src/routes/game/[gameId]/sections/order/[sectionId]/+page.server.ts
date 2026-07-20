import { requireAuth } from "$lib/server/auth";
import { getError } from "$lib/server/util";
import { error, fail, redirect } from "@sveltejs/kit";
import z from "zod";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user, } = requireAuth();
  const section = await prisma.gameSection.findFirst({
    where: {
      id: event.params.sectionId,
      creatorId: user.id,
    },
    include: {categories: {orderBy: {order: "asc",},},},
  });
  if (!section) error(404);
  return {section,};
};

export const actions: Actions = {
  default: async (event) => {
    requireAuth();
    const formData = await event.request.formData();
    const {success, data, error, } = saveSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.order),});
    }
    try {
      await prisma.$transaction(async tx => {
        for (let i = 0; i < data.order.length; ++i) {
          await tx.gameCategory.updateMany({
            data: {order: i,},
            where: {id: data.order[i],},
          });
        }
      });
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId!}`);
  },
};

const saveSchema = zfd.formData({order: zfd.repeatableOfType(zfd.text(z.uuidv4())),});
