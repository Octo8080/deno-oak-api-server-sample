import { Context } from "../deps.ts";
import {
  tryDeletePost,
  tryGetPosts,
  tryInsertPost,
} from "../repositories/posts.ts";
import { tryGetToken } from "../repositories/token.ts";
import { logError } from "../util/logger.ts";
import { createHashString } from "../util/hash.ts";
import { getBearerToken } from "../util/request.ts";

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

  const result = getBearerToken(context);
  if (!result.status) {
    context.response.status = 400;
    return;
  }

  const hashedToken = createHashString(result.token);

  try {
    const client = await tryGetToken(hashedToken);
    const posts = await tryInsertPost(client.clientId, value.text);
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

  const result = getBearerToken(context);
  if (!result.status) {
    context.response.status = 400;
    return;
  }

  const hashedToken = createHashString(result.token);

  try {
    const client = await tryGetToken(hashedToken);
    const result = await tryDeletePost(client.clientId, value.id);
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
