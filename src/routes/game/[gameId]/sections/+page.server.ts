import {requireAuth} from "$lib/server/auth";
import {getError} from "$lib/server/util";
import {error, fail, redirect} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {Actions, PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth();
  const game = await prisma.game.findFirst({
    where: {
      id: event.params.gameId,
      creatorId: user.id,
    },
    include: {
      sections: {
        orderBy: {order: "asc",},
        include: {categories: {select: {id: true,},},},
      },
    },
  });
  if (!game) error(404);
  return {game,};
};

export const actions: Actions = {
  save: async (event) => {
    requireAuth();
    const formData = await event.request.formData();
    const {success, data, error,} = saveSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.order),});
    }
    try {
      await prisma.$transaction(async tx => {
        for (let i = 0; i < data.order.length; ++i) {
          await tx.gameSection.update({
            data: {order: i,},
            where: {id: data.order[i],},
          });
        }
      });
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId!}`);
  },
  addsection: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error,} = addSectionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.name),});
    }
    try {
      const orderCount = await prisma.gameSection.count({where: {gameId: event.params.gameId,},});
      const result = await prisma.gameSection.create({
        data: {
          name: data.name,
          gameId: event.params.gameId!,
          creatorId: user.id,
          order: orderCount,
        },
      });
      return {type: "add", id: result.id, name: result.name,};
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
  },
  removesection: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error,} = deleteSectionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.id),});
    }
    try {
      const section = await prisma.gameSection.findFirst({
        where: {
          id: data.id,
          creatorId: user.id,
        },
        include: {categories: {select: {id: true,},},},
      });
      if (!section) return fail(404, {msg: "Not Found",});
      if (section.categories.length > 0) return fail(400, {msg: "Not Empty",});
      await prisma.$transaction(async tx => {
        await tx.gameSection.delete({where: {id: section.id,},});
        await tx.gameSection.updateMany({
          data: {order: {decrement: 1,},},
          where: {
            gameId: section.gameId,
            order: {gt: section.order,},
          },
        });
      });
      return {type: "rem", id: section.id,};
    } catch (error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
  },
};

const saveSchema = zfd.formData({order: zfd.repeatableOfType(zfd.text(z.uuidv4())),});
const addSectionSchema = zfd.formData({name: zfd.text(z.string().trim().min(3)),});
const deleteSectionSchema = zfd.formData({id: zfd.text(z.uuidv4()),});
