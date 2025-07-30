import { requireAuth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { gameBoardSectionTable, gameTable } from "$lib/server/db/schema";
import { getError } from "$lib/server/util";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import z from "zod";
import { zfd } from "zod-form-data";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const {user, } = requireAuth();
  const game = await db.query.gameTable.findFirst({
    where: and(
      eq(gameTable.id, event.params.gameId),
      eq(gameTable.creatorId, user.id)
    ),
    with: {
      sections: {
        orderBy: asc(gameBoardSectionTable.order),
        with: {categories: {columns: {id: true,},},},
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
    const {success, data, error, } = saveSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.order),});
    }
    try {
      await db.transaction(async tx => {
        for (let i = 0; i < data.order.length; ++i) {
          await tx.update(gameBoardSectionTable).set({order: i,})
            .where(eq(gameBoardSectionTable.id, data.order[i]));
        }
      });
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
    redirect(302, `/game/${event.params.gameId!}`);
  },
  addsection: async (event) => {
    const {user, } = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error, } = addSectionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.name),});
    }
    try {
      const orderCount = db.$with("order_count").as(
        db.select({value: sql`count(*)`.as("value"),}).from(gameBoardSectionTable)
          .where(eq(gameBoardSectionTable.gameId, event.params.gameId!))
      );
      const [result,] = await db.with(orderCount).insert(gameBoardSectionTable).values({
        name: data.name,
        gameId: event.params.gameId!,
        creatorId: user.id,
        order: sql`(select * from ${orderCount})`,
      }).returning();
      return {type: "add", id: result.id, name: result.name,};
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
  },
  removesection: async (event) => {
    const {user, } = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error, } = deleteSectionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(error);
      return fail(400, {msg: getError(errs?.properties?.id),});
    }
    try {
      const section = await db.query.gameBoardSectionTable.findFirst({
        where: and(
          eq(gameBoardSectionTable.id, data.id),
          eq(gameBoardSectionTable.creatorId, user.id)
        ),
        with: {categories: {columns: {id: true,},},},
      });
      if (!section) return fail(404, {msg: "Not Found",});
      if (section.categories.length > 0) return fail(400, {msg: "Not Empty",});
      await db.transaction(async tx => {
        await tx.delete(gameBoardSectionTable).where(eq(gameBoardSectionTable.id, section.id));
        await tx.update(gameBoardSectionTable)
          .set({ order: sql`${gameBoardSectionTable.order} - 1`, })
          .where(and(
            eq(gameBoardSectionTable.gameId, section.gameId),
            gt(gameBoardSectionTable.order, section.order)
          ));
      });
      return {type: "rem", id: section.id,};
    } catch(error) {
      console.error(error);
      return fail(500, {msg: "Internal Server Error",});
    }
  },
};

const saveSchema = zfd.formData({order: zfd.repeatableOfType(zfd.text(z.uuidv4())),});
const addSectionSchema = zfd.formData({name: zfd.text(z.string().min(3).trim()),});
const deleteSectionSchema = zfd.formData({id: zfd.text(z.uuidv4()),});
