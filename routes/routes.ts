import { Router } from "../deps.ts";
import { token } from "../handler/oauth2_handler.ts";
import { resourceRouter } from "./resource_routes.ts";

const router = new Router();

router.use(
  "/resource",
  resourceRouter.routes(),
  resourceRouter.allowedMethods(),
);
router.post("/oauth2/token", token);

export { router };
