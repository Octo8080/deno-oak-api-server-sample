//import * as log from "https://deno.land/std@0.140.0/log/mod.ts";
import { log } from "../deps.ts";
import { config } from "../config/config.ts";

const fileHandler = new log.handlers.RotatingFileHandler("DEBUG", {
  filename: `./log/${config.logFile}`,
  formatter: "{datetime} {levelName} {msg}",
  maxBytes: 1048576,
  maxBackupCount: 30,
});

await log.setup({
  //define handlers
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: "{datetime} {levelName} {msg}",
    }),
    file: fileHandler,
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});

const logger = log.getLogger();
//const logger = log.getLogger();
function logDebug(text: string) {
  logger.debug(text);
}
function logInfo(text: string) {
  logger.info(text);
}
function logWarn(text: string) {
  logger.warning(text);
}
function logError(text: string) {
  logger.error(text);
}
function doLogFlash() {
  fileHandler.flush;
}

export { doLogFlash, logDebug, logError, logInfo, logWarn };
