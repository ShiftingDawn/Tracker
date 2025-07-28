import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return {user: null,};

  return {
    user: event.locals.user,
  };
};