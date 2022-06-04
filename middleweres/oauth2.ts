import { Context as OakContext } from "../deps.ts";
import { accessResourceRequestCheck } from "../validates/oauth2_validates.ts";
import { logError } from "../util/logger.ts";

interface AuthSuccess {
  status: true;
  clientId: string;
}

interface AuthFailure {
  status: false;
}

type Auth = AuthFailure | AuthSuccess;

export type Context = OakContext & {
  auth?: Auth;
};

export function isAuthSuccess(rawArg:unknown): rawArg is AuthSuccess{
  const arg = rawArg as {[key:string]:unknown}

  if(!arg) return false
  if(!arg.status ) return false
  if(typeof arg.status !== "boolean")  return false
  if(arg.status !== true)  return false

  return true
}

export async function beforeResourceAccess(
  context: Context,
  next: () => Promise<unknown>
) {
  const copyRequest = Object.assign(context.request);
  const result = await accessResourceRequestCheck(copyRequest);
  if (!result.status) {
    logError("Invalid Access !!");
    context.response.status = 400;
    context.auth = { status: false };
    return;
  }
  context.auth = { status: true, clientId: result.clientId };

  await next();
}
