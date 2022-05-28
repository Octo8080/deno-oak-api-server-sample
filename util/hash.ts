import { createHash } from "../deps.ts";
import { config } from "../config/config.ts";

export function createHashString(plainString: string): string {
  const hash = createHash("sha256");
  hash.update(`${config.salt}-${plainString}-${config.salt}`);
  return hash.toString();
}

export function isHashedStringValid(
  plainString: string,
  hashedString: string,
): boolean {
  return createHashString(plainString) === hashedString;
}
