import { authProcedure, router } from "@/server/trpc";
import {
  createCommentRequest,
  deleteCommentRequest,
  deleteReplyCommentRequest,
  editCommentRequest,
  editReplyCommentRequest,
  getReplyCommentRequest,
  replyCommentRequest,
} from "@/server/validation/comment.validation";
import {
  createComment,
  deleteComment,
  deleteReplyComment,
  editComment,
  editReplyComment,
  getReplyComment,
  replyComment,
} from "./comment.service";

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
  editReplyComment: authProcedure
    .input(editReplyCommentRequest)
    .mutation(async ({ ctx, input }) =>
      editReplyComment(ctx.prisma, ctx.user.id, input),
    ),
  deleteReplyComment: authProcedure
    .input(deleteReplyCommentRequest)
    .mutation(async ({ ctx, input }) =>
      deleteReplyComment(ctx.prisma, ctx.user.id, input),
    ),
  getReplyComment: authProcedure
    .input(getReplyCommentRequest)
    .query(async ({ ctx, input }) =>
      getReplyComment(ctx.prisma, input),
    ),
});
