import type {LayoutServerLoad} from "./$types";

export const load: LayoutServerLoad = async (event) => {
  return {
    isLoggedIn: Boolean(event.locals.user),
    breadcrumbs: [] as {name: string, href: string}[],
  };
};
