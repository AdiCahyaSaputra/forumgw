import { z } from "zod";

export const createCommentRequest = z.object({
  public_id: z.string(),
  text: z.string(),
  mention_users: z.array(z.string()).nullable(),
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
