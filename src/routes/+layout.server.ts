import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async (event) => {
  return {
    isLoggedIn: Boolean(event.locals.user),
    username: event.locals.user?.username ?? null,
    userId: event.locals.user?.id ?? null,
    breadcrumbs: [] as {name: string, href: string}[],
  };
};
