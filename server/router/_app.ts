import { router } from "../trpc";
import { commentRouter } from "./comment/comment.router";
import { notificationRouter } from "./notification/notification.router";
import { postRouter } from "./post/post.router";
import { userRouter } from "./user/user.router";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
