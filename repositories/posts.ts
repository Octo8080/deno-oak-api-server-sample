import { Post } from "../db/db_client.ts";
import { logError } from "../util/logger.ts";

interface PostObject {
  clientId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

function isPost(rawArg: unknown): rawArg is PostObject {
  if (!rawArg) return false;
  const arg = rawArg as { [key: string]: unknown };
  if (arg.clientId === undefined) return false;
  if (typeof arg.clientId !== "string") return false;
  if (arg.text === undefined) return false;
  if (typeof arg.text !== "string") return false;
  if (arg.createdAt === undefined) return false;
  if (typeof arg.createdAt !== "string") return false;
  if (arg.updatedAt === undefined) return false;
  if (typeof arg.updatedAt !== "string") return false;

  return true;
}

function isPosts(rawArg: unknown): rawArg is PostObject[] {
  if (!rawArg) return false;
  if (!Array.isArray(rawArg)) return false;
  if (!rawArg.every(isPost)) return false;
  return true;
}

export async function tryGetPosts(): Promise<PostObject[]> | never {
  const postObjects = await Post.all();

  if (!postObjects) throw new Error("posts is nullable!");
  if (!Array.isArray(postObjects)) throw new Error("posts is not array!");
  if (postObjects.length == 0) return postObjects as unknown as PostObject[];

  if (!isPosts(postObjects)) throw new Error("Object is not Post[]");

  return postObjects;
}

export async function tryInsertPost(
  clientId: string,
  text: string,
): Promise<{ clientId: string; text: string }> | never {
  const post = new Post();
  post.clientId = clientId;
  post.text = text;
  const r = await post.save();

  if (r.affectedRows !== 1) throw new Error("Client not save!");

  return { clientId, text };
}

export async function tryDeletePost(
  clientId: string,
  id: string,
): Promise<boolean> | never {
  try {
    const r =
      (await Post.where("client_id", clientId).where("id", id).delete()) as ({
        [key: string]: unknown;
      } | undefined);
    if (r === undefined) throw new Error("Post is not affect!");
    if (r.affectedRows == undefined) throw new Error("Post is not affect!");
    if (r.affectedRows !== 1) throw new Error("Post is not affectedRow 1!");
    return true;
  } catch (e) {
    logError(e);
    throw new Error("Post is not delete!");
  }
}
