import { authProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { createComment, deleteComment, editComment } from "./comment.service";

export const commentRouter = router({
  createComment: authProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => createComment(ctx.prisma, input)),
  editComment: authProcedure
    .input(
      z.object({
        commentId: z.number(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => editComment(ctx.prisma, input)),
  deleteComment: authProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => deleteComment(ctx.prisma, input)),
});
