import {error, type Handle} from "@sveltejs/kit";
import * as auth from "$lib/server/auth";

const MAX_BODY_SIZE = 1025 * 512;

const handleAuth: Handle = async ({event, resolve,}) => {
  const contentLength = event.request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_SIZE) {
    if (event.url.pathname !== "/api/img/upload") {
      throw error(413, "Request body too large");
    }
  }

  const sessionId = auth.getSessionId(event);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
  const {session, user,} = await auth.getCurrentSession(sessionId);
  if (session) {
    auth.setSessionTokenCookie(event, sessionId, session.expiresAt);
  } else {
    auth.destroyCurrentSession(event);
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

export const handle: Handle = handleAuth;
