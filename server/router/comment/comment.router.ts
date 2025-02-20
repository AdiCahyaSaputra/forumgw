import { authProcedure, router } from "@/server/trpc";
import {
  createComment,
  deleteComment,
  editComment,
  replyComment,
} from "./comment.service";
import {
  createCommentRequest,
  deleteCommentRequest,
  editCommentRequest,
  replyCommentRequest,
} from "@/server/validation/comment.validation";

export const commentRouter = router({
  createComment: authProcedure
    .input(createCommentRequest)
    .mutation(async ({ ctx, input }) =>
      createComment(ctx.prisma, ctx.user.id, input),
    ),
  editComment: authProcedure
    .input(editCommentRequest)
    .mutation(async ({ ctx, input }) =>
      editComment(ctx.prisma, ctx.user.id, input),
    ),
  deleteComment: authProcedure
    .input(deleteCommentRequest)
    .mutation(async ({ ctx, input }) =>
      deleteComment(ctx.prisma, ctx.user.id, input),
    ),
  replyComment: authProcedure
    .input(replyCommentRequest)
    .mutation(async ({ ctx, input }) =>
      replyComment(ctx.prisma, ctx.user.id, input),
    ),
});
