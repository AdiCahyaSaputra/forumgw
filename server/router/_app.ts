import { procedure, router } from "../trpc";
import { commentRouter } from "./comment/comment.router";
import { postRouter } from "./post/post.router";
import { userRouter } from "./user/user.router";

export const appRouter = router({
  hello: procedure.query(async ({ ctx }) => {
    return "Hello World";
  }),
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
