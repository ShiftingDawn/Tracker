import { error, type RequestEvent } from "@sveltejs/kit";
import type { User } from "./schema";
import { redis } from ".";

function keyMaker(type: string): (name: string, eventOrUser: RequestEvent | User) => string {
  return (name, eventOrUser) => {
    const user = "locals" in eventOrUser ? eventOrUser.locals.user : eventOrUser;
    if (!user) error(403);
    return `${type}.${name}.${user.id}`;
  };
}

export const keySectionCollapse = keyMaker("sectioncollapse");

export const rSetBool = (k: string, v: boolean) => redis.set(k, v ? "1" : "0");
export const rGetBool = async (k: string) => (await redis.get(k)) === "1";
