import { authProcedure, router } from "@/server/trpc";
import { getNotification, notificationIsReaded } from "./notification.service";
import { z } from "zod";

export const notificationRouter = router({
  getNotification: authProcedure.query(
    async ({ ctx }) => await getNotification(ctx.prisma, ctx.user.id),
  ),
  notificationIsReaded: authProcedure
    .input(
      z.object({
        notification_id: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input }) =>
        await notificationIsReaded(ctx.prisma, input.notification_id),
    ),
});
