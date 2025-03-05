import { z } from "zod";

export const createCommentRequest = z.object({
  public_id: z.string(),
  text: z.string(),
  mention_users: z.array(z.string()).nullable(),
  groupPublicId: z.string().nullable().default(null)
});

export const editCommentRequest = z.object({
  comment_id: z.number(),
  text: z.string(),
  mention_users: z.array(z.string()).nullable(),
});

export const deleteCommentRequest = z.object({
  comment_id: z.number(),
});

export const replyCommentRequest = z.object({
  comment_id: z.number(),
  text: z.string(),
  mention_users: z.array(z.string()).nullable(),
});

export const editReplyCommentRequest = z.object({
  reply_comment_id: z.number(),
  text: z.string(),
  mention_users: z.array(z.string()).nullable(),
});

export const deleteReplyCommentRequest = z.object({
  reply_comment_id: z.number(),
});

export const getReplyCommentRequest = z.object({
  commentId: z.number(),
});
