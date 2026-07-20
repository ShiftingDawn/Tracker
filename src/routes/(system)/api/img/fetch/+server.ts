import type {RequestHandler} from "@sveltejs/kit";
import {requireAuth} from "$lib/server/auth";
import {prisma} from "$lib/server/db";

export const GET: RequestHandler = async (event) => {
  const {user,} = requireAuth(event);
  const results = await prisma.imageStore.findMany({where: {creatorId: user.id,},});
  return Response.json(results);
};
