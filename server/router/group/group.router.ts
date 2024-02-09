import { authProcedure, router } from "@/server/trpc";
import {
  acceptOrDeclineInvite,
  createGroup,
  getAllGroupByUser,
  getGroupByQuery,
  getGroupInvitation,
} from "./group.service";
import { z } from "zod";

export const groupRouter = router({
  getAllGroupByUser: authProcedure.query(
    async ({ ctx }) => await getAllGroupByUser(ctx.prisma, ctx.user.id),
  ),
  createGroup: authProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        invitedUsername: z.array(z.string()).nullable(),
      }),
    )
    .mutation(
      async ({ ctx, input }) =>
        await createGroup(ctx.prisma, input, ctx.user.id),
    ),

  getGroupInvitation: authProcedure.query(
    async ({ ctx }) => await getGroupInvitation(ctx.prisma, ctx.user.id),
  ),

  acceptOrDeclineInvite: authProcedure
    .input(
      z.object({
        type: z.enum(["accept", "decline"]),
        invite_id: z.number(),
        group_id: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }) =>
        await acceptOrDeclineInvite(ctx.prisma, input, ctx.user.id),
    ),

  getGroupByQuery: authProcedure
    .input(
      z.object({
        searchTerm: z.string().min(1).nullable(),
      }),
    )
    .query(
      async ({ ctx, input }) =>
        await getGroupByQuery(ctx.prisma, input.searchTerm),
    ),
});
