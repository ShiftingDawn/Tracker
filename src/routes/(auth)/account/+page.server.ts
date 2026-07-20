import {requireAuth} from "$lib/server/auth";
import {keySectionCollapse, rGetBool} from "$lib/server/db/redis";
import type {PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const {user,} = requireAuth(event);

  const collapseData = {
    ownGames: await rGetBool(keySectionCollapse("profile.owngames", user)),
    contribCategories: await rGetBool(keySectionCollapse("profile.contribcategories", user)),
    contribQuests: await rGetBool(keySectionCollapse("profile.contribquests", user)),
    contribTasks: await rGetBool(keySectionCollapse("profile.contribtasks", user)),
  };

  const gamesResult = await prisma.game.findMany({
    orderBy: {createdAt: "desc",},
    where: {creatorId: user.id,},
    select: {
      id: true,
      name: true,
      icon: true,
      _count: {select: {sections: true,},},
      sections: {select: {_count: {select: {categories: true,},},},},
    },
  });
  const games = gamesResult.map((game) => ({
    id: game.id,
    name: game.name,
    icon: game.icon,
    sectionCount: game._count.sections,
    categoryCount: game.sections.reduce(
      (sum, section) => sum + section._count.categories,
      0
    ),
  }));

  const contribCategoriesResult = await prisma.gameCategory.findMany({
    orderBy: {createdAt: "desc",},
    where: {
      creatorId: user.id,
      section: {game: {creatorId: {not: user.id,},},},
    },
    select: {
      id: true,
      name: true,
      icon: true,
      section: {
        select: {
          game: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {select: {quests: true,},},
    },
  });
  const contribCategories = contribCategoriesResult.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    gameId: category.section.game.id,
    gameName: category.section.game.name,
    questCount: category._count.quests,
  }));

  const contribQuestsResult = await prisma.gameQuest.findMany({
    orderBy: {createdAt: "desc",},
    where: {
      creatorId: user.id,
      category: {
        creatorId: {not: user.id,},
        section: {game: {creatorId: {not: user.id,},},},
      },
    },
    select: {
      id: true,
      name: true,
      icon: true,
      category: {
        select: {
          id: true,
          name: true,
          section: {
            select: {
              game: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const contribQuests = contribQuestsResult.map((quest) => ({
    id: quest.id,
    name: quest.name,
    icon: quest.icon,
    gameId: quest.category.section.game.id,
    gameName: quest.category.section.game.name,
    categoryId: quest.category.id,
    categoryName: quest.category.name,
  }));

  const contribTasksResult = await prisma.gameQuestTask.findMany({
    orderBy: {createdAt: "desc",},
    where: {
      creatorId: user.id,
      quest: {
        category: {
          creatorId: {not: user.id,},
          section: {game: {creatorId: {not: user.id,},},},
        },
      },
    },
    select: {
      id: true,
      name: true,
      icon: true,
      quest: {
        select: {
          id: true,
          name: true,
          category: {
            select: {
              id: true,
              name: true,
              section: {
                select: {
                  game: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const contribTasks = contribTasksResult.map((task) => ({
    id: task.id,
    name: task.name,
    icon: task.icon,
    gameId: task.quest.category.section.game.id,
    gameName: task.quest.category.section.game.name,
    categoryId: task.quest.category.id,
    categoryName: task.quest.category.name,
    questId: task.quest.id,
    questName: task.quest.name,
  }));

  return {
    collapseData,
    games: gamesResult,
    contribCategories,
    contribQuests,
    contribTasks,
  };
};
