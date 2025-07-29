import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { gameTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const game = await db.query.gameTable.findFirst({
    where: eq(gameTable.id, event.params.gameId),
    with: {creator: {columns: {username: true,},},},
  });
  if (!game) error(404);
  return {game,};
};
