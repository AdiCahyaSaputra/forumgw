import { authProcedure, devProcedure, procedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  createPost,
  deletePost,
  getDetailedPost,
  getFeedByCategory,
  getReportedPost,
  getUserPosts,
  updatePost,
} from "./post.service";

export const postRouter = router({
  getFeedByCategory: procedure
    .input(z.object({ categoryId: z.enum(["1", "2"]) }))
    .query(async ({ ctx, input }) =>
      getFeedByCategory(ctx.prisma, input.categoryId)
    ),
  getReportedPost: devProcedure.query(async ({ ctx }) =>
    getReportedPost(ctx.prisma)
  ),
  getUserPosts: authProcedure
    .input(
      z.object({
        userId: z.string(),
        withAnonymousPosts: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) =>
      getUserPosts(ctx.prisma, input.userId, input.withAnonymousPosts)
    ),
  getDetailedPost: procedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => getDetailedPost(ctx.prisma, input.postId)),
  createPost: authProcedure
    .input(
      z.object({
        content: z.string(),
        categoryId: z.enum(["1", "2"]),
        userId: z.string(),
        isAnonymousPost: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data: Omit<typeof input, "isAnonymousPost"> = input;

      return createPost(ctx.prisma, data, input.isAnonymousPost);
    }),
  updatePost: authProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        categoryId: z.enum(["1", "2"]),
        userId: z.string(),
        visibilityTo: z.enum(["anonymous", "public"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data: Omit<typeof input, "postId" | "visibilityTo"> = input;

      return updatePost(ctx.prisma, input.postId, data, input.visibilityTo);
    }),
  deletePost: authProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => deletePost(ctx.prisma, input.postId)),
});
