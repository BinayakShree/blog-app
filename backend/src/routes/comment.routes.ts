import { Hono } from "hono";
import createCommentController from "../controllers/commentControllers/createCommentController";
import userAuth from "../middlewares/userAuth";
import getPostCommentsController from "../controllers/commentControllers/getPostCommentsController";
import likeCommentController from "../controllers/commentControllers/likeCommentController";
import editCommentController from "../controllers/commentControllers/editCommentController";
import deleteCommentController from "../controllers/commentControllers/deleteCommentController";
import getCommentsController from "../controllers/commentControllers/getCommentsController";

const commentRouter = new Hono();
commentRouter.post("/create", userAuth, createCommentController);
commentRouter.get("/getpostcomments/:postId", getPostCommentsController);
commentRouter.put("/likecomment/:commentId", userAuth, likeCommentController);
commentRouter.put("/editcomment/:commentId", userAuth, editCommentController);
commentRouter.delete("/deletecomment/:commentId", userAuth, deleteCommentController);
commentRouter.get("/getcomments", userAuth, getCommentsController);
export default commentRouter;
