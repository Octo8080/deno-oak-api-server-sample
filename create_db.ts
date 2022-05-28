import { doClose, getDbClient } from "./db/db_client.ts";

getDbClient();
await doClose();
Deno.exit();
