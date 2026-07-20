import {requireAuth} from "$lib/server/auth";
import {toggleQuestPin} from "$lib/server/questutils";
import {getError} from "$lib/server/util";
import {fail} from "@sveltejs/kit";
import z from "zod";
import {zfd} from "zod-form-data";
import type {Actions, PageServerLoad} from "./$types";
import {keySectionCollapse, rGetBool} from "$lib/server/db/redis";
import {toggleTaskComplete, toggleTaskPin} from "$lib/server/taskutils";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const quest = (await event.parent()).quest;
  const tasks = await prisma.gameQuestTask.findMany({
    where: {questId: quest.id,},
    orderBy: {order: "asc",},
    include: {
      creator: {select: {username: true,},},
      completed: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
      pinned: event.locals.user ? {
        where: {userId: event.locals.user.id,},
        take: 1,
      } : undefined,
    },
  });
  const completionData = event.locals.user ? await prisma.userQuestCompletion.findFirst({
    where: {
      userId: event.locals.user.id,
      questId: event.params.questId,
    },
  }) : null;
  const collapseData = event.locals.user ? {
    pin: await rGetBool(keySectionCollapse(`pnd${quest.id}`, event)),
    incomplete: await rGetBool(keySectionCollapse(`inc${quest.id}`, event)),
    complete: await rGetBool(keySectionCollapse(`cmp${quest.id}`, event)),
  } : undefined;
  return {
    tasks,
    completionData,
    collapseData,
  };
};

export const actions: Actions = {
  togglecompletion: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = toggleCompletionSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        completed: getError(errs.properties?.completed),
      });
    }
    try {
      const completed = await prisma.userQuestCompletion.findFirst({
        where: {
          userId: user.id,
          questId: event.params.questId,
        },
      });
      if (Boolean(completed) === data.completed) return fail(400);
      if (completed) {
        await prisma.userQuestCompletion.deleteMany({
          where: {
            userId: user.id,
            questId: event.params.questId,
          },
        });
      } else {
        await prisma.userQuestCompletion.create({
          data: {
            userId: user.id,
            questId: event.params.questId,
          },
        });
      }
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
  togglepin: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = togglePinSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        pinned: getError(errs.properties?.pinned),
      });
    }
    try {
      await toggleQuestPin(user.id, event.params.questId!, event.params.categoryId!, data.pinned);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
  toggletaskpin: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = toggleTaskPinSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        task: getError(errs.properties?.task),
        pinned: getError(errs.properties?.pinned),
      });
    }
    try {
      await toggleTaskPin(user.id, data?.task, event.params.questId!, data.pinned);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
  toggletaskcomplete: async (event) => {
    const {user,} = requireAuth();
    const formData = await event.request.formData();
    const {success, data, error: parseError,} = toggleTaskCompleteSchema.safeParse(formData);
    if (!success) {
      const errs = z.treeifyError(parseError);
      return fail(400, {
        success: false,
        task: getError(errs.properties?.task),
        completed: getError(errs.properties?.completed),
      });
    }
    try {
      await toggleTaskComplete(user.id, data?.task, data.completed);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "Internal server error",});
    }
  },
};

const toggleCompletionSchema = zfd.formData({completed: zfd.checkbox(),});
const togglePinSchema = zfd.formData({pinned: zfd.checkbox(),});
const toggleTaskPinSchema = zfd.formData({
  task: zfd.text(z.uuidv4()),
  pinned: zfd.checkbox(),
});
const toggleTaskCompleteSchema = zfd.formData({
  task: zfd.text(z.uuidv4()),
  completed: zfd.checkbox(),
});
