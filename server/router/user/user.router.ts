import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { authProcedure, procedure, router } from "@/server/trpc";
import { z } from "zod";
import { editProfile, getProfile, signIn, signUp } from "./user.service";

export const userRouter = router({
  signUp: procedure
    .input(
      z.object({
        username: z.string().min(3).trim().toLowerCase(),
        name: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => signUp(ctx.prisma, input)),
  signIn: procedure
    .input(
      z.object({
        username: z.string().min(3).trim().toLowerCase(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => signIn(ctx.prisma, input)),
  getAuthUser: authProcedure.query(async ({ ctx }) => {
    return sendTRPCResponse(
      {
        status: 200,
        message: "Nih user yang telah login",
      },
      ctx.user
    );
  }),
  getProfile: authProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => getProfile(ctx.prisma, input)),
  editProfile: authProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string().min(3).trim().toLowerCase(),
        bio: z.string().max(100).nullable(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => editProfile(ctx.prisma, input)),
});
