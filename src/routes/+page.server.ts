import {prisma} from "$lib/server/db";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async (event) => {
  const recentGames = await prisma.game.findMany({
    take: 5,
    orderBy: {createdAt: "desc",},
    select: {
      id: true,
      name: true,
      icon: true,
      _count: {select: {sections: true,},},
      sections: {select: {_count: {select: {categories: true,},},},},
    },
  });
  const result = recentGames.map((game) => ({
    id: game.id,
    name: game.name,
    icon: game.icon,
    sectionCount: game._count.sections,
    categoryCount: game.sections.reduce(
      (sum, section) => sum + section._count.categories,
      0
    ),
  }));

  return {user: event.locals.user, recentGames: result,};
};
