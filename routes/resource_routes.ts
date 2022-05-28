import { Router } from "../deps.ts";
import { deletePost, newPost, posts } from "../handler/resource_handler.ts";
import { beforeResourceAccess } from "../middleweres/oauth2.ts";

const resourceRouter = new Router();
resourceRouter.use(beforeResourceAccess);
resourceRouter.get("/posts", posts);
resourceRouter.post("/posts", newPost);
resourceRouter.delete("/posts", deletePost);

export { resourceRouter };
