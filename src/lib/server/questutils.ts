import {fail} from "@sveltejs/kit";
import {prisma} from "$lib/server/db";

export async function toggleQuestPin(userId: string, questId: string, categoryId: string, shouldPin: boolean) {
  const pinned = await prisma.userQuestPinned.findFirst({where: {userId, questId,},});
  if (Boolean(pinned) === shouldPin) return fail(400);
  await prisma.$transaction(async tx => {
    if (pinned) {
      await tx.userQuestPinned.deleteMany({where: {userId, questId,},});
      const questIds = await tx.gameQuest.findMany({
        where: {categoryId,},
        select: {id: true,},
      });
      await tx.userQuestPinned.updateMany({
        where: {
          order: {gt: pinned.order,},
          questId: {in: questIds.map((q) => q.id),},
        },
        data: {order: {decrement: 1,},},
      });
    } else {
      const orderCount = await prisma.userQuestPinned.count({where: {quest: {categoryId,},},});
      await prisma.userQuestPinned.create({
        data: {
          userId: userId,
          questId: questId,
          order: orderCount,
        },
      });
    }
  });
}
