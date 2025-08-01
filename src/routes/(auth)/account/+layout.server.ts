import { addBreadcrumb } from "$lib/server/util";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  return addBreadcrumb({}, event, "User profile", "/account");
};
