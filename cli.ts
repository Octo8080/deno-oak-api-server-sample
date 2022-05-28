import { parse, SpinnerTypes, TerminalSpinner } from "./deps.ts";
import { config } from "./config/config.ts";
import { createHashString } from "./util/hash.ts";
import { logError, logInfo } from "./util/logger.ts";
import { doClose } from "./db/db_client.ts";
import { tryExistClient, tryInsertClient } from "./repositories/clients.ts";

const { id, secret, h } = parse(Deno.args);

if (h) {
  console.info(`
Register OAuth 2 Client!
  --id     [required]: client id
  --secret [required]: client secret

Example 
  deno run --allow-read=./db/${config.dataBaseFile} cli.ts --id hogehoge --secret hogehogehoge

  `);
  Deno.exit();
}

let doRegister = true;

if (!id) {
  logError("not set id!");
  doRegister = false;
}

if (!secret) {
  logError("not set secret!");
  doRegister = false;
}

if (!doRegister) {
  Deno.exit();
}

if (await tryExistClient(id)) {
  logError(`id=[${id}] is duplicate!`);
  doRegister = false;
}

if (!doRegister) {
  await doClose();
  Deno.exit();
}

const terminalSpinner = new TerminalSpinner({
  text: "Try register client!",
  color: "green",
  spinner: SpinnerTypes.dots,
  indent: 0,
  cursor: false,
  writer: Deno.stdout,
});

terminalSpinner.start();

await tryInsertClient(id, createHashString(secret));

terminalSpinner.stop();

await doClose();
logInfo("Register client success!");
Deno.exit();
