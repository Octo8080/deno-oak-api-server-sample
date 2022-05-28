import { Context } from "../deps.ts";
import {
  accessTokenRequestCheck,
  checkBasicAuth,
} from "../validates/oauth2_validates.ts";
import { logError } from "../util/logger.ts";
import { tryInsertToken } from "../repositories/token.ts";
import { createHashString } from "../util/hash.ts";

export async function token(context: Context) {
  if (!checkBasicAuth(context.request)) {
    logError("BasicAuth is invalid!");
    context.response.status = 400;
    return;
  }
  const result = await accessTokenRequestCheck(context.request);
  if (!result.status) {
    logError("Token request is invalid!");
    context.response.status = 400;
    return;
  }
  const token = crypto.randomUUID();
  const hashedToken = createHashString(token);

  await tryInsertToken(result.clientId, hashedToken);

  context.response.body = {
    access_token: token,
    token_type: "bearer",
    expires_in: 3600,
  };
}
