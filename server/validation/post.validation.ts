import { z } from "zod";

export const getTagsRequest = z.object({
  tag_ids: z.array(z.string()),
  tag_names: z.string(),
});

export const getFeedByCategoryAndTagRequest = z.object({
  category_id: z.enum(["1", "2"]),
  tag_ids: z.array(z.string()),
  cursor: z.string().nullish(),
});

export const getPostReportedReasonsRequest = z.object({
  post_id: z.string(),
});

export const getUserPostsRequest = z.object({
  withAnonymousPosts: z.boolean().default(false),
  withComments: z.boolean().default(false),
});

export const getDetailedPostRequest = z.object({
  public_id: z.string(),
});

export const createPostTagRequest = z.object({
  name: z.string(),
});

export const createPostRequest = z.object({
  content: z.string(),
  category_id: z.enum(["1", "2"]),
  isAnonymousPost: z.boolean().default(false),
  tags: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export const updatePostRequest = z.object({
  post_id: z.string(),
  content: z.string(),
  visibilityTo: z.enum(["anonymous", "public"]),
  tags: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export const deletePostRequest = z.object({
  post_id: z.string(),
});

export const reportPostRequest = z.object({
  public_id: z.string(),
  reason: z.string(),
});

export const safePostRequest = z.object({
  post_id: z.string(),
});

export const takeDownRequest = z.object({
  post_id: z.string(),
});
