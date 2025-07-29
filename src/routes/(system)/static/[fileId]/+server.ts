import { readFile } from "$lib/server/fileservices";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
  const fileId = event.params.fileId;
  return new Response(await readFile(fileId), {headers: {"Content-Type": "image/png",},});
};
