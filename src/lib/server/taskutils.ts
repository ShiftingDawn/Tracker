import {fail} from "@sveltejs/kit";
import {prisma} from "$lib/server/db";

export async function toggleTaskPin(userId: string, taskId: string, questId: string, shouldPin: boolean) {
  const pinned = await prisma.userQuestTaskPinned.findFirst({
    where: {
      userId,
      taskId,
    },
  });
  if (Boolean(pinned) === shouldPin) return fail(400);
  await prisma.$transaction(async tx => {
    if (pinned) {
      await tx.userQuestTaskPinned.deleteMany({where: {userId, taskId,},});
      const taskIds = await tx.gameQuestTask.findMany({
        where: {questId,},
        select: {id: true,},
      });
      await tx.userQuestTaskPinned.updateMany({
        where: {
          order: {gt: pinned.order,},
          taskId: {in: taskIds.map((q) => q.id),},
        },
        data: {order: {decrement: 1,},},
      });
    } else {
      const orderCount = await prisma.userQuestTaskPinned.count({where: {task: {questId,},},});
      await prisma.userQuestTaskPinned.create({
        data: {
          userId,
          taskId,
          order: orderCount,
        },
      });
    }
  });
}

export async function toggleTaskComplete(userId: string, taskId: string, shouldComplete: boolean) {
  const completed = await prisma.userQuestTaskCompletion.findFirst({
    where: {
      userId,
      taskId,
    },
  });
  if (Boolean(completed) === shouldComplete) return fail(400);
  if (completed) {
    await prisma.userQuestTaskCompletion.deleteMany({
      where: {
        userId,
        taskId,
      },
    });
  } else {
    await prisma.userQuestTaskCompletion.create({
      data: {
        userId,
        taskId,
      },
    });
  }
}
