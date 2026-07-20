import {env} from "$env/dynamic/private";
import Redis from "ioredis";
import {Prisma, PrismaClient} from "../../../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg(env.DATABASE_URL);
export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter,});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const redis = new Redis(env.REDIS_URL);

export type User = Prisma.UserGetPayload<object>;
export type Session = Prisma.SessionGetPayload<object>;
export type ImageStore = Prisma.ImageStoreGetPayload<object>;
export type Game = Prisma.GameGetPayload<object>;
export type GameSection = Prisma.GameSectionGetPayload<object>;
export type GameCategory = Prisma.GameCategoryGetPayload<object>;
export type GameQuest = Prisma.GameQuestGetPayload<object>;
export type UserQuestCompletion = Prisma.UserQuestCompletionGetPayload<object>;
export type UserQuestPinned = Prisma.UserQuestPinnedGetPayload<object>;
export type GameQuestTask = Prisma.GameQuestTaskGetPayload<object>;
export type UserQuestTaskCompletion = Prisma.UserQuestTaskCompletionGetPayload<object>;
export type UserQuestTaskPinned = Prisma.UserQuestTaskPinnedGetPayload<object>;
