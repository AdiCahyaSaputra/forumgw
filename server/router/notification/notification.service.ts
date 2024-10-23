import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { PrismaContext } from "@/server/trpc";

export const getNotification = async (
  prisma: PrismaContext,
  author_id: string,
) => {
  const notifications = await prisma.notification.findMany({
    where: {
      to_user: author_id,
      OR: [
        { type: NotificationType.comment },
        { type: NotificationType.report },
      ],
    },
    select: {
      id: true,
      type: true,
      is_read: true,
      post: {
        select: {
          public_id: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!notifications.length) {
    return sendTRPCResponse(
      {
        status: 404,
        message: "Akun nya sepi bre yahaha",
      },
      [],
    );
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ada notif ni bre",
    },
    notifications,
  );
};

export const notificationIsReaded = async (
  prisma: PrismaContext,
  notification_id: string,
) => {
  const updatedNotif = await prisma.notification.update({
    where: {
      id: notification_id,
    },
    data: {
      is_read: true,
    },
  });

  if (!updatedNotif) {
    return sendTRPCResponse(
      {
        status: 400,
        message: "Aku gak bisa ngelakuin itu :(",
      },
      [],
    );
  }

  return sendTRPCResponse({
    status: 201,
    message: "Ok bre, Rajin banget baca notif :)",
  });
};
