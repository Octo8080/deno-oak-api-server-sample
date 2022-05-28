import { Context } from "../deps.ts";
import { accessResourceRequestCheck } from "../validates/oauth2_validates.ts";
import { logError } from "../util/logger.ts";

export async function beforeResourceAccess(
  context: Context,
  next: () => Promise<unknown>,
) {
  const copyRequest = Object.assign(context.request);
  const result = await accessResourceRequestCheck(copyRequest);
  if (!result.status) {
    logError("Invalid Access !!");
    context.response.status = 400;
    return;
  }
  await next();
}
