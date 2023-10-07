import { authProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { createComment, deleteComment, editComment } from "./comment.service";

export const commentRouter = router({
  createComment: authProcedure
    .input(
      z.object({
        public_id: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      createComment(ctx.prisma, ctx.user.id, input),
    ),
  editComment: authProcedure
    .input(
      z.object({
        comment_id: z.number(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      editComment(ctx.prisma, ctx.user.id, input),
    ),
  deleteComment: authProcedure
    .input(
      z.object({
        comment_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      deleteComment(ctx.prisma, ctx.user.id, input),
    ),
});
