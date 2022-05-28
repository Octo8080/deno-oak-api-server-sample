import { Context } from '../deps.ts';

interface BearerTokenSuccess {
  status: true;
  token: string;
}
interface BearerTokenFailure {
  status: false;
}

type BearerToken = BearerTokenSuccess | BearerTokenFailure;

export function getBearerToken(context: Context): BearerToken {
  const auth = context.request.headers.get("authorization");
  if (!auth) return { status: false };
  const token = auth.split("Bearer ")[1];
  if (!token) return { status: false };
  return { status: true, token };
}
