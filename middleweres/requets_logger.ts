import { Context } from "../deps.ts";
import { logInfo } from "../util/logger.ts";

export async function beforeAccessLog(
  context: Context,
  next: () => Promise<unknown>,
) {
  const r = context.request;
  const text = `ACCESS IP:${r.ip}, METHOD: ${r.method}, URL: ${r.url}`;
  logInfo(text);
  await next();
}
