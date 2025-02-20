import { authProcedure, devProcedure, procedure, router } from "@/server/trpc";
import {
  createPostRequest,
  createPostTagRequest,
  deletePostRequest,
  getDetailedPostRequest,
  getFeedByCategoryAndTagRequest,
  getPostReportedReasonsRequest,
  getTagsRequest,
  getUserPostsRequest,
  reportPostRequest,
  safePostRequest,
  takeDownRequest,
  updatePostRequest,
} from "@/server/validation/post.validation";
import {
  createPost,
  createTag,
  deletePost,
  getAllOrSpecificTags,
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
  getTags: procedure
    .input(getTagsRequest)
    .query(
      async ({ ctx, input }) =>
        await getAllOrSpecificTags(ctx.prisma, input.tag_ids, input.tag_names)
    ),
  getFeedByCategoryAndTag: procedure
    .input(getFeedByCategoryAndTagRequest)
    .query(
      async ({ ctx, input }) =>
        await getFeedByCategory(
          ctx.prisma,
          input.category_id,
          input.tag_ids,
          input.cursor
        )
    ),
  getPostReportedReasons: devProcedure
    .input(getPostReportedReasonsRequest)
    .query(async ({ ctx, input }) =>
      getPostReportedReasons(ctx.prisma, input.post_id)
    ),
  getReportedPost: devProcedure.query(async ({ ctx }) =>
    getReportedPost(ctx.prisma)
  ),
  getUserPosts: authProcedure
    .input(getUserPostsRequest)
    .query(async ({ ctx, input }) =>
      getUserPosts(ctx.prisma, ctx.user.id, input.withAnonymousPosts)
    ),
  getDetailedPost: procedure
    .input(getDetailedPostRequest)
    .query(async ({ ctx, input }) =>
      getDetailedPost(ctx.prisma, input.public_id)
    ),
  createPostTag: authProcedure
    .input(createPostTagRequest)
    .mutation(async ({ ctx, input }) => await createTag(ctx.prisma, input)),
  createPost: authProcedure
    .input(createPostRequest)
    .mutation(async ({ ctx, input }) => {
      const data: Omit<typeof input, "isAnonymousPost"> & { user_id: string } =
        {
          ...input,
          user_id: ctx.user.id,
          category_id:
            ctx.user.role?.name === "developer" ? input.category_id : "1",
        };

      return createPost(ctx.prisma, data, input.isAnonymousPost);
    }),
  updatePost: authProcedure
    .input(updatePostRequest)
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
    .input(deletePostRequest)
    .mutation(async ({ ctx, input }) => deletePost(ctx.prisma, input.post_id)),
  reportPost: authProcedure
    .input(reportPostRequest)
    .mutation(async ({ ctx, input }) =>
      reportPost(ctx.prisma, input.public_id, input.reason)
    ),
  safePost: devProcedure
    .input(safePostRequest)
    .mutation(async ({ ctx, input }) => safePost(ctx.prisma, input.post_id)),
  takeDown: devProcedure
    .input(takeDownRequest)
    .mutation(async ({ ctx, input }) => takeDown(ctx.prisma, input.post_id)),
});
