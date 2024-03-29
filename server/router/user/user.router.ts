import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { authProcedure, procedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  editProfile,
  getProfile,
  searchUser,
  signIn,
  signUp,
} from "./user.service";

export const userRouter = router({
  signUp: procedure
    .input(
      z.object({
        username: z.string().min(3).trim().toLowerCase(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => signUp(ctx.prisma, input)),
  signIn: procedure
    .input(
      z.object({
        username: z.string().min(3).trim().toLowerCase(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => signIn(ctx.prisma, input)),
  getAuthUser: authProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return sendTRPCResponse(
      {
        status: 200,
        message: "Nih user yang telah login",
      },
      user,
    );
  }),
  getProfile: authProcedure
    .input(
      z.object({
        username: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) =>
      getProfile(ctx.prisma, ctx.user.id, input),
    ),
  editProfile: authProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string().min(3).trim().toLowerCase(),
        bio: z.string().max(100).nullable(),
        image: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      editProfile(ctx.prisma, ctx.user.id, input),
    ),
  searchUser: authProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => searchUser(ctx.prisma, input.username)),
});
