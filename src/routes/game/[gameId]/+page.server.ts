import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  return {isOwner: event.locals.user?.id === (await event.parent()).game.creatorId,};
};
