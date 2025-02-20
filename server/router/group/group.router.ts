import { authProcedure, router } from "@/server/trpc";
import {
  acceptOrDeclineInviteRequest,
  acceptOrDeclineJoinRequestValidation,
  askToJoinGroupRequest,
  createGroupPostRequest,
  createGroupRequest,
  deleteGroupRequest,
  editGroupRequest,
  exitFromGroupRequest,
  getDetailedGroupMemberByPublicIdRequest,
  getDetailedGroupPostRequest,
  getGroupByPublicIdRequest,
  getGroupByQueryRequest,
  getGroupJoinRequestValidation,
  getGroupPostByAuthorRequest,
} from "@/server/validation/group.validation";
import {
  acceptOrDeclineInvite,
  acceptOrDeclineJoinRequest,
  askToJoinGroup,
  createGroup,
  createGroupPost,
  deleteGroup,
  editGroup,
  exitFromGroup,
  getAllGroupByUser,
  getDetailedGroupMemberByPublicId,
  getDetailedGroupPost,
  getGroupByAuthor,
  getGroupByPublicId,
  getGroupByQuery,
  getGroupInvitation,
  getGroupJoinRequest,
  getGroupPostByAuthor,
} from "./group.service";

export const groupRouter = router({
  getAllGroupByUser: authProcedure.query(
    async ({ ctx }) => await getAllGroupByUser(ctx.prisma, ctx.user.id)
  ),
  createGroup: authProcedure
    .input(createGroupRequest)
    .mutation(
      async ({ ctx, input }) =>
        await createGroup(ctx.prisma, input, ctx.user.id)
    ),

  getGroupInvitation: authProcedure.query(
    async ({ ctx }) => await getGroupInvitation(ctx.prisma, ctx.user.id)
  ),

  acceptOrDeclineInvite: authProcedure
    .input(acceptOrDeclineInviteRequest)
    .mutation(
      async ({ ctx, input }) =>
        await acceptOrDeclineInvite(ctx.prisma, input, ctx.user.id)
    ),

  getGroupByQuery: authProcedure
    .input(getGroupByQueryRequest)
    .query(
      async ({ ctx, input }) =>
        await getGroupByQuery(ctx.prisma, ctx.user.id, input.searchTerm)
    ),
  getGroupByPublicId: authProcedure
    .input(getGroupByPublicIdRequest)
    .query(
      async ({ ctx, input }) =>
        await getGroupByPublicId(ctx.prisma, ctx.user.id, input.public_id)
    ),
  createGroupPost: authProcedure
    .input(createGroupPostRequest)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        user_id: ctx.user.id,
      };
      return await createGroupPost(ctx.prisma, data, input.isAnonymousPost);
    }),
  getDetailedGroupPost: authProcedure
    .input(getDetailedGroupPostRequest)
    .query(async ({ ctx, input }) => {
      const data = {
        ...input,
        user_id: ctx.user.id,
      };
      return getDetailedGroupPost(ctx.prisma, data);
    }),
  getGroupPostByAuthor: authProcedure
    .input(getGroupPostByAuthorRequest)
    .query(
      async ({ ctx, input }) =>
        await getGroupPostByAuthor(ctx.prisma, input, ctx.user.id)
    ),
  editGroup: authProcedure
    .input(editGroupRequest)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        user_id: ctx.user.id,
      };
      return editGroup(ctx.prisma, data);
    }),
  deleteGroup: authProcedure
    .input(deleteGroupRequest)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        user_id: ctx.user.id,
      };

      return deleteGroup(ctx.prisma, data);
    }),
  getGroupByAuthor: authProcedure.query(
    async ({ ctx }) => await getGroupByAuthor(ctx.prisma, ctx.user.id)
  ),
  getDetailedGroupMemberByPublicId: authProcedure
    .input(getDetailedGroupMemberByPublicIdRequest)
    .query(async ({ ctx, input }) =>
      getDetailedGroupMemberByPublicId(ctx.prisma, ctx.user.id, input.public_id)
    ),
  askToJoinGroup: authProcedure
    .input(askToJoinGroupRequest)
    .mutation(
      async ({ ctx, input }) =>
        await askToJoinGroup(ctx.prisma, ctx.user.id, input.public_id)
    ),

  getGroupJoinRequest: authProcedure
    .input(getGroupJoinRequestValidation)
    .query(
      async ({ ctx, input }) =>
        await getGroupJoinRequest(ctx.prisma, ctx.user.id, input.public_id)
    ),

  acceptOrDeclineJoinRequest: authProcedure
    .input(acceptOrDeclineJoinRequestValidation)
    .mutation(
      async ({ ctx, input }) =>
        await acceptOrDeclineJoinRequest(ctx.prisma, input, ctx.user.id)
    ),

  exitFromGroup: authProcedure
    .input(exitFromGroupRequest)
    .mutation(
      async ({ ctx, input }) =>
        await exitFromGroup(ctx.prisma, ctx.user.id, input.public_id)
    ),
});
