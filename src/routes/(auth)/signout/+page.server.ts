import { destroyCurrentSession } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  await destroyCurrentSession(event);
  redirect(302, "/");
};
