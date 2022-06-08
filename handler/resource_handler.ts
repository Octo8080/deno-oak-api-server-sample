import { Context, isAuthSuccess } from "../middleweres/oauth2.ts";
import {
  tryDeletePost,
  tryGetPosts,
  tryInsertPost,
} from "../repositories/posts.ts";
import { logError } from "../util/logger.ts";

export async function posts(context: Context) {
  try {
    const posts = await tryGetPosts();
    context.response.body = posts;
  } catch (e) {
    logError(e);
    context.response.status = 400;
  }
}

export async function newPost(context: Context) {
  if (!context.request.hasBody) {
    context.response.status = 400;
    return;
  }

  const value = await context.request.body({ type: "json" }).value;
  if (value.text === null || typeof value.text !== "string") {
    context.response.status = 400;
    return;
  }

  try {
    if (!isAuthSuccess(context.auth)) throw new Error("Not Auth");
    const posts = await tryInsertPost(context.auth.clientId, value.text);
    if (!posts) {
      context.response.status = 400;
      return;
    }
    context.response.body = { status: true };
  } catch (e) {
    logError(e);
    context.response.status = 400;
  }
}

export async function deletePost(context: Context) {
  if (!context.request.hasBody) {
    context.response.status = 400;
    return;
  }

  const value = await context.request.body({ type: "json" }).value;
  if (value.text === null || typeof value.id !== "string") {
    context.response.status = 400;
    return;
  }

  try {
    if (!isAuthSuccess(context.auth)) throw new Error("Not Auth");
    const result = await tryDeletePost(context.auth.clientId, value.id);
    if (!result) {
      context.response.status = 400;
      return;
    }
    context.response.body = { status: true };
  } catch (e) {
    logError(e);
    context.response.status = 400;
  }
}
