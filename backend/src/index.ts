import { Hono } from "hono";
import { cors } from "hono/cors";
import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comment.routes";

const app = new Hono();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://binayakshree.vercel.app"],
    credentials: true,
  })
);
app.route("/blog/api/v1/user", userRouter);
app.route("/blog/api/v1/post", postRouter);
app.route("/blog/api/v1/comment", commentRouter);
export default app;
