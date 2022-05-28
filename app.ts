import { Application } from "./deps.ts";
import { router } from "./routes/routes.ts";
import { doClose } from "./db/db_client.ts";
import { beforeAccessLog } from "./middleweres/requets_logger.ts";

const app = new Application();

app.use(beforeAccessLog);
app.use(router.routes());
app.use(router.allowedMethods());
Deno.addSignalListener("SIGINT", () => {
  doClose();
  Deno.exit();
});

console.info("Start Server!!");
app.listen({ port: 8080 });
