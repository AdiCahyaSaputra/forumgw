import { procedure, router } from "../trpc";
import { postRouter } from "./post/post.router";
import { userRouter } from "./user/user.router";

export const appRouter = router({
  hello: procedure.query(async ({ ctx }) => {
    return "Hello World";
  }),
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
