import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { gameQuestTable, userQuestPinnedTable } from "./db/schema";
import { fail } from "@sveltejs/kit";

export async function toggleQuestPin(userId: string, questId: string, categoryId: string, shouldPin: boolean) {
  const pinned = await db.query.userQuestPinnedTable.findFirst({
    where: and(
      eq(userQuestPinnedTable.userId, userId),
      eq(userQuestPinnedTable.questId, questId)
    ),
  });
  if (Boolean(pinned) === shouldPin) return fail(400);
  await db.transaction(async (tx) => {
    if (pinned) {
      await tx.delete(userQuestPinnedTable).where(and(
        eq(userQuestPinnedTable.userId, userId),
        eq(userQuestPinnedTable.questId, questId)
      ));
      await tx.update(userQuestPinnedTable)
        .set({ order: sql`${userQuestPinnedTable.order} - 1`, })
        .where(and(
          gt(userQuestPinnedTable.order, pinned.order),
          inArray(
            userQuestPinnedTable.questId,
            tx.select({id: gameQuestTable.id,})
              .from(gameQuestTable)
              .where(eq(gameQuestTable.categoryId, categoryId))
          )
        ));
    } else {
      const orderCount = tx.$with("order_count").as(
        tx.select({value: sql`count(*)`.as("value"),})
          .from(userQuestPinnedTable)
          .innerJoin(gameQuestTable, eq(userQuestPinnedTable.questId, gameQuestTable.id))
          .where(eq(gameQuestTable.categoryId, categoryId))
      );
      await tx.with(orderCount).insert(userQuestPinnedTable).values({
        userId: userId,
        questId: questId,
        order: sql`(select * from ${orderCount})`,
      });
    }
  });
}
