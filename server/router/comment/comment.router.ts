import { authProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { createComment, deleteComment, editComment } from "./comment.service";

export const commentRouter = router({
  createComment: authProcedure
    .input(
      z.object({
        post_id: z.string(),
        user_id: z.string(),
        text: z.string(),
        author_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => createComment(ctx.prisma, input)),
  editComment: authProcedure
    .input(
      z.object({
        comment_id: z.number(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => editComment(ctx.prisma, input)),
  deleteComment: authProcedure
    .input(
      z.object({
        comment_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => deleteComment(ctx.prisma, input)),
});
