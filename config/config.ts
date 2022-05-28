import "https://deno.land/std@0.139.0/dotenv/load.ts";

export const config = {
  basicSecret: Deno.env.get("BASIC_SECRET")!,
  salt: Deno.env.get("SALT")!,
  dataBaseFile: Deno.env.get("DATA_BASE_FILE")!,
  logFile: Deno.env.get("LOG_FILE")!,
};
