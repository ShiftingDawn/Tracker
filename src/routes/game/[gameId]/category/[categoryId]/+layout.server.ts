import {addBreadcrumb} from "$lib/server/util";
import type {LayoutServerLoad} from "./$types";
import {prisma} from "$lib/server/db";
import {error} from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const category = await prisma.gameCategory.findFirst({
    where: {id: event.params.categoryId,},
    include: {
      creator: true,
      section: {include: {game: true,},},
    },
  });
  if (!category) return error(404);
  return await addBreadcrumb(
    {
      category,
      categoryCreator: category.creator,
      isCategoryOwner: category.section.creatorId === event.locals.user?.id,
    },
    event,
    category.name,
    `/game/${category.section.game.id}/category/${category.id}`
  );
};
