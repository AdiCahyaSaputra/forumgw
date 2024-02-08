import { router } from "../trpc";
import { commentRouter } from "./comment/comment.router";
import { groupRouter } from "./group/group.router";
import { notificationRouter } from "./notification/notification.router";
import { postRouter } from "./post/post.router";
import { userRouter } from "./user/user.router";

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  notification: notificationRouter,
  group: groupRouter,
});

export type AppRouter = typeof appRouter;
