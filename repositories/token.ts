import { Token } from "../db/db_client.ts";
import { dateTimeStringForDb } from "../util/time.ts";

interface TokenObject {
  clientId: string;
  hashedToken: string;
  expirationAt: string;
  createdAt: string;
  updatedAt: string;
}

function isToken(rawArg: unknown): rawArg is TokenObject {
  if (!rawArg) return false;
  const arg = rawArg as { [key: string]: unknown };
  if (arg.clientId === undefined) return false;
  if (typeof arg.clientId !== "string") return false;
  if (arg.hashedToken === undefined) return false;
  if (typeof arg.hashedToken !== "string") return false;
  if (arg.expirationAt === undefined) return false;
  if (typeof arg.expirationAt !== "string") return false;
  if (arg.createdAt === undefined) return false;
  if (typeof arg.createdAt !== "string") return false;
  if (arg.updatedAt === undefined) return false;
  if (typeof arg.updatedAt !== "string") return false;

  return true;
}

export async function tryGetToken(token: string): Promise<TokenObject> | never {
  const nowString = dateTimeStringForDb(new Date());
  const tokenObject = await Token.where("hashed_token", token).where(
    "expiration_at",
    ">",
    nowString,
  ).orderBy("expiration_at", "desc").first();

  if (!tokenObject) throw new Error("token is nullable!");
  if (!isToken(tokenObject)) throw new Error("Object is not Token");

  return tokenObject;
}

export async function tryInsertToken(
  clientId: string,
  hashedToken: string,
): Promise<{ clientId: string; hashedToken: string }> | never {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  const expirationAt = dateTimeStringForDb(d);

  const token = new Token();
  token.clientId = clientId;
  token.hashedToken = hashedToken;
  token.expirationAt = expirationAt;
  const r = await token.save();

  if (r.affectedRows !== 1) throw new Error("Client not save!");

  return { clientId, hashedToken };
}
