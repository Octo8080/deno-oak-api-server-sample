import { Request } from "../deps.ts";
import { config } from "../config/config.ts";
import { tryGetClient } from "../repositories/clients.ts";
//import { orm, Token } from "../db/orm.ts";
import { createHashString, isHashedStringValid } from "../util/hash.ts";
import { logError } from "../util/logger.ts";
import { tryGetToken } from "./../repositories/token.ts";

interface Oauth2RequestCheckResultFailure {
  status: false;
}
interface Oauth2RequestCheckResultSuccess {
  status: true;
  clientId: string;
}

type Oauth2RequestCheckResult =
  | Oauth2RequestCheckResultFailure
  | Oauth2RequestCheckResultSuccess;

export async function accessResourceRequestCheck(
  req: Request,
): Promise<Oauth2RequestCheckResult> {
  const auth = req.headers.get("authorization");
  if (!auth) return { status: false };
  const token = auth.split("Bearer ")[1];
  if (!token) return { status: false };

  const hashedToken = createHashString(token);

  try {
    const client = await tryGetToken(hashedToken);
    return { status: true, clientId: client.clientId };
  } catch (e) {
    logError(e);
  }
  return { status: false };
}

export async function accessTokenRequestCheck(
  req: Request,
): Promise<Oauth2RequestCheckResult> {
  const value = await req.body({ type: "form" }).value;
  const clientId = (await value).get("client_id");
  const clientSecret = (await value).get("client_secret");
  const grantType = (await value).get("grant_type");

  if (grantType !== "client_credentials") return { status: false };
  if (!clientId) return { status: false };
  if (typeof clientId !== "string") return { status: false };
  if (!clientSecret) return { status: false };

  try {
    const client = await tryGetClient(clientId);

    if (!client) return { status: false };
    if (!isHashedStringValid(clientSecret, client.hashedSecret)) {
      return { status: false };
    }
  } catch (e) {
    logError(e);
    return { status: false };
  }

  return { status: true, clientId };
}

export function checkBasicAuth(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const s = auth.split("Basic ")[1];
  if (!s) return false;
  if (s !== config.basicSecret) return false;
  return true;
}
