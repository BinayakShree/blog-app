import { Hono } from "hono";
import createPostController from "../controllers/postControllers/createPostController";
import userAuth from "../middlewares/userAuth";
import getPostsController from "../controllers/postControllers/getPostsController";
import deletePostController from "../controllers/postControllers/deletePostController";
import updatePostController from "../controllers/postControllers/updatePostController";
import getPostCategoryController from "../controllers/postControllers/getPostCategoryController";
const postRouter = new Hono();

postRouter.post("/create", userAuth, createPostController);
postRouter.get("/getposts", getPostsController);
postRouter.delete(
  "/deletepost/:postId/:userId",
  userAuth,
  deletePostController
);
postRouter.put("/updatepost/:postId/:userId", userAuth, updatePostController);
postRouter.get("/getpostcategory", getPostCategoryController);

export default postRouter;
