import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import {gameQuestTable, gameQuestTaskTable, userQuestPinnedTable, userQuestTaskPinnedTable} from "./db/schema";
import { fail } from "@sveltejs/kit";

export async function toggleTaskPin(userId: string, taskId: string, questId: string, shouldPin: boolean) {
  const pinned = await db.query.userQuestTaskPinnedTable.findFirst({
    where: and(
      eq(userQuestTaskPinnedTable.userId, userId),
      eq(userQuestTaskPinnedTable.questTaskId, taskId)
    ),
  });
  if (Boolean(pinned) === shouldPin) return fail(400);
  await db.transaction(async (tx) => {
    if (pinned) {
      await tx.delete(userQuestTaskPinnedTable).where(and(
        eq(userQuestTaskPinnedTable.userId, userId),
        eq(userQuestTaskPinnedTable.questTaskId, taskId)
      ));
      await tx.update(userQuestTaskPinnedTable)
        .set({ order: sql`${userQuestTaskPinnedTable.order} - 1`, })
        .where(and(
          gt(userQuestTaskPinnedTable.order, pinned.order),
          inArray(
            userQuestTaskPinnedTable.questTaskId,
            tx.select({id: gameQuestTaskTable.id,})
              .from(gameQuestTaskTable)
              .where(eq(gameQuestTaskTable.questId, questId))
          )
        ));
    } else {
      const orderCount = tx.$with("order_count").as(
        tx.select({value: sql`count(*)`.as("value"),})
          .from(userQuestTaskPinnedTable)
          .innerJoin(gameQuestTaskTable, eq(userQuestTaskPinnedTable.questTaskId, gameQuestTaskTable.id))
          .where(eq(gameQuestTaskTable.questId, questId))
      );
      await tx.with(orderCount).insert(userQuestTaskPinnedTable).values({
        userId: userId,
        questTaskId: taskId,
        order: sql`(select * from ${orderCount})`,
      });
    }
  });
}
