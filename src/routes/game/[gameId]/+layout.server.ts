import {addBreadcrumb} from "$lib/server/util";
import {error} from "@sveltejs/kit";
import type {LayoutServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: LayoutServerLoad = async (event) => {
  const game = await prisma.game.findFirst({
    where: {id: event.params.gameId,},
    include: {
      creator: {select: {username: true,},},
      sections: {
        orderBy: {order: "asc",},
        include: {
          creator: {select: {username: true,},},
          categories: {
            orderBy: {order: "asc",},
            include: {creator: {select: {username: true,},},},
          },
        },
      },
    },
  });
  if (!game) error(404);
  return await addBreadcrumb(
    {
      game,
      gameCreator: game.creator,
      isGameOwner: game.creatorId === event.locals.user?.id,
    },
    event,
    game.name,
    `/game/${game.id}`
  );
};
