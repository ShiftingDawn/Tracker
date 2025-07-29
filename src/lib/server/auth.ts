import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { sessionTable, type Session, type User } from "./db/schema";
import { getRequestEvent } from "$app/server";

const SESSION_COOKIE_NAME = "sid";
const SESSION_MAX_AGE = 3600 * 24 * 28 * 1000;

export function getSessionId(event: RequestEvent): string|null {
  return event.cookies.get(SESSION_COOKIE_NAME) ?? null;
}

export async function createSession(event: RequestEvent, userId: string): Promise<Session> {
  const [session,] = await db.insert(sessionTable).values({
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
  }).returning();
  setSessionTokenCookie(event, session.id, session.expiresAt);
  return session;
}

export function setSessionTokenCookie(event: RequestEvent, sessonId: string, expiresAt: Date) {
  event.cookies.set(SESSION_COOKIE_NAME, sessonId, {
    secure: env.NODE_ENV !== "development",
    path: "/",
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
  });
}

export type ServerSession = {session: null, user: null} | {session: Session, user: User};
export async function getCurrentSession(sid: string): Promise<ServerSession> {
  const sessionAndUser = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.id, sid),
    with: {user: true,},
  });
  if (!sessionAndUser) return { session: null, user: null, };

  const isExpired = Date.now() >= sessionAndUser.expiresAt.getTime();
  if (isExpired) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionAndUser.id));
    return { session: null, user: null, };
  }

  const shouldRenew = Date.now() >= (sessionAndUser.expiresAt.getTime() - (SESSION_MAX_AGE / 2));
  if (shouldRenew) {
    sessionAndUser.expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
    await db.update(sessionTable).set({ expiresAt: sessionAndUser.expiresAt, }).where(eq(sessionTable.id, sessionAndUser.id));
  }

  return { session: sessionAndUser, user: sessionAndUser.user, };
}

export async function destroyCurrentSession(event: RequestEvent) {
  const sid = getSessionId(event);
  if (sid) {
    await destroySession(sid);
  }
  event.cookies.delete("sid", {path: "/",});
}

async function destroySession(sessionId: string) {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

type RequireAuthResult = {user: User, session: Session} | never;
export function requireAuth(event?: RequestEvent): RequireAuthResult {
  const e = event ?? getRequestEvent();
  if (!e.locals.session) {
    return redirect(302, "/signin");
  }
  return {user: e.locals.user, session: e.locals.session,};
}
