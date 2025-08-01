import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/postgres-js";
import Redis from "ioredis";
import postgres from "postgres";
import * as schema from "./schema";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!env.REDIS_URL) throw new Error("REDIS_URL is not set");

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema, });
export const redis = new Redis(env.REDIS_URL);
