import { Hono } from "hono";
import signupController from "../controllers/userControllers/signup.controller";
import signinController from "../controllers/userControllers/signin.controller";
import googleLoginController from "../controllers/userControllers/googleLoginController";
import updateUserController from "../controllers/userControllers/updateUserController";
import userAuth from "../middlewares/userAuth";
import deleteUserController from "../controllers/userControllers/deleteUserController";
import logoutController from "../controllers/userControllers/logout";
import getUserController from "../controllers/userControllers/getUserController";

const userRouter = new Hono();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);
userRouter.post("/google", googleLoginController);
userRouter.put("/update/:userId", userAuth, updateUserController);
userRouter.delete("/delete/:userId", userAuth, deleteUserController);
userRouter.post("/logout", logoutController);
userRouter.get("/getusers", userAuth, getUserController);

export default userRouter;
