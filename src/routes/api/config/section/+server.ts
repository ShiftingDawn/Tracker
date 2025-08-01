import { keySectionCollapse, rSetBool } from "$lib/server/db/redis";
import z from "zod";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
  try {
    const data = schema.parse(await event.request.json());
    await rSetBool(keySectionCollapse(data.id, event), data.collapsed);
    return new Response();
  } catch(error) {
    console.error(error);
    return new Response(null, {status: 500, });
  }
};
const schema = z.object({
  id: z.string(),
  collapsed: z.boolean(),
});
