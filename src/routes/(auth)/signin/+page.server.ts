import * as auth from "$lib/server/auth";
import {fail, redirect} from "@sveltejs/kit";
import {compareSync} from "bcrypt";
import type {Actions, PageServerLoad} from "./$types";
import {prisma} from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, {message: "Invalid username (min 3, max 24 characters, alphanumeric only)",});
    }
    if (!validatePassword(password)) {
      return fail(400, {message: "Invalid password (min 8, max 255 characters)",});
    }

    const user = await prisma.user.findFirst({where: {username,},});
    if (!user || !compareSync(password, user.password)) {
      return fail(400, {message: "Incorrect username or password",});
    }

    const session = await auth.createSession(event, user.id);
    auth.setSessionTokenCookie(event, session.id, session.expiresAt);
    return redirect(302, "/");
  },
};

function validateUsername(username: unknown): username is string {
  return typeof username === "string" && username.length >= 3 && username.length <= 24 && /^[a-z0-9_-]+$/.test(username);
}

function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 255;
}
