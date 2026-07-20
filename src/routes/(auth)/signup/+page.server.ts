import * as auth from "$lib/server/auth";
import {fail, redirect} from "@sveltejs/kit";
import {hashSync} from "bcrypt";
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
    const password2 = formData.get("password2");

    if (!validateUsername(username)) {
      return fail(400, {message: "Invalid username",});
    }
    if (!validatePassword(password)) {
      return fail(400, {message: "Invalid password",});
    }
    if (password !== password2) {
      return fail(400, {message: "Passwords do not match",});
    }
    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashSync(password, 12),
        },
      });
      const session = await auth.createSession(event, user.id);
      auth.setSessionTokenCookie(event, session.id, session.expiresAt);
    } catch (error) {
      console.error(error);
      return fail(500, {message: "An error has occurred",});
    }
    return redirect(302, "/");
  },
};

function validateUsername(username: unknown): username is string {
  return typeof username === "string" && username.length >= 3 && username.length <= 24 && /^[a-z0-9_-]+$/.test(username);
}

function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 255;
}
