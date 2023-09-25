import { authProcedure, devProcedure, procedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  createPost,
  deletePost,
  getDetailedPost,
  getFeedByCategory,
  getPostReportedReasons,
  getReportedPost,
  getUserPosts,
  reportPost,
  safePost,
  takeDown,
  updatePost,
} from "./post.service";

export const postRouter = router({
  getFeedByCategory: procedure
    .input(z.object({ category_id: z.enum(["1", "2"]) }))
    .query(
      async ({ ctx, input }) =>
        await getFeedByCategory(ctx.prisma, input.category_id),
    ),
  getPostReportedReasons: devProcedure
    .input(
      z.object({
        post_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) =>
      getPostReportedReasons(ctx.prisma, input.post_id),
    ),
  getReportedPost: devProcedure.query(async ({ ctx }) =>
    getReportedPost(ctx.prisma),
  ),
  getUserPosts: authProcedure
    .input(
      z.object({
        withAnonymousPosts: z.boolean().default(false),
        withComments: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) =>
      getUserPosts(ctx.prisma, ctx.user.id, input.withAnonymousPosts),
    ),
  getDetailedPost: procedure
    .input(
      z.object({
        post_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) =>
      getDetailedPost(ctx.prisma, input.post_id),
    ),
  createPost: authProcedure
    .input(
      z.object({
        content: z.string(),
        category_id: z.enum(["1", "2"]),
        isAnonymousPost: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: Omit<typeof input, "isAnonymousPost"> & { user_id: string } =
      {
        ...input,
        user_id: ctx.user.id,
        category_id:
          ctx.user.role.name === "developer" ? input.category_id : "1",
      };

      return createPost(ctx.prisma, data, input.isAnonymousPost);
    }),
  updatePost: authProcedure
    .input(
      z.object({
        post_id: z.string(),
        content: z.string(),
        category_id: z.enum(["1", "2"]),
        visibilityTo: z.enum(["anonymous", "public"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: Omit<typeof input, "post_id" | "visibilityTo"> & {
        user_id: string;
      } = {
        ...input,
        user_id: ctx.user.id,
      };

      return updatePost(ctx.prisma, input.post_id, data, input.visibilityTo);
    }),
  deletePost: authProcedure
    .input(
      z.object({
        post_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => deletePost(ctx.prisma, input.post_id)),
  reportPost: authProcedure
    .input(
      z.object({
        post_id: z.string(),
        reason: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      reportPost(ctx.prisma, input.post_id, input.reason),
    ),
  safePost: devProcedure
    .input(
      z.object({
        post_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => safePost(ctx.prisma, input.post_id)),
  takeDown: devProcedure
    .input(
      z.object({
        post_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => takeDown(ctx.prisma, input.post_id)),
});
