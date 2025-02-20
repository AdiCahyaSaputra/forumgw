import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { authProcedure, procedure, router } from "@/server/trpc";
import {
  editProfileRequest,
  getProfileRequest,
  mentioningUserRequest,
  searchUserRequest,
  signInRequest,
  signUpRequest,
} from "@/server/validation/user.validation";
import {
  editProfile,
  getProfile,
  getUsersForMentioning,
  searchUser,
  signIn,
  signUp,
} from "./user.service";

export const userRouter = router({
  signUp: procedure
    .input(signUpRequest)
    .mutation(async ({ ctx, input }) => signUp(ctx.prisma, input)),
  signIn: procedure
    .input(signInRequest)
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
      user
    );
  }),
  getProfile: authProcedure
    .input(getProfileRequest)
    .query(async ({ ctx, input }) =>
      getProfile(ctx.prisma, ctx.user.id, input)
    ),
  editProfile: authProcedure
    .input(editProfileRequest)
    .mutation(async ({ ctx, input }) =>
      editProfile(ctx.prisma, ctx.user.id, input)
    ),
  searchUser: authProcedure
    .input(searchUserRequest)
    .mutation(async ({ ctx, input }) => searchUser(ctx.prisma, input.username)),
  getUsersForMentioning: authProcedure
    .input(mentioningUserRequest)
    .query(
      async ({ ctx, input }) =>
        await getUsersForMentioning(ctx.prisma, input, ctx.user.id)
    ),
});
