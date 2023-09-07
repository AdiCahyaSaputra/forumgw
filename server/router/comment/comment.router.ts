import { authProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { createComment } from "./comment.service";

export const commentRouter = router({
  createComment: authProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => createComment(ctx.prisma, input)),
});
