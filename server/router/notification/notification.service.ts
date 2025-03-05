import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { prisma } from "@/prisma/db";
import { PrismaContext } from "@/server/trpc";
import { PrismaClient, user } from "@prisma/client";
import { ITXClientDenyList } from "@prisma/client/runtime/library";

type TInsertNotification = {
  post_id: string;
  user_id: string;
  type: NotificationType;
  is_read: boolean;
  to_user: string;
};

export const getNotification = async (
  prisma: PrismaContext,
  author_id: string,
) => {
  const notifications = await prisma.notification.findMany({
    where: {
      to_user: author_id,
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
      comment_id: true // Just for mention
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

export const notifyMentionedUser = async (
  userIds: user["id"][],
  data: Omit<TInsertNotification, "to_user">,
  tx?: Omit<PrismaClient, ITXClientDenyList>,
) => {
  try {
    const notifications = userIds.map((mentionedUserId) => ({
      ...data,
      to_user: mentionedUserId,
    }));

    if (tx) {
      await tx.notification.createMany({
        data: notifications,
      });

      return;
    }

    await prisma.notification.createMany({
      data: notifications,
    });

    return;
  } catch (err) {
    console.error(err);
    throw Error("Gak bisa notifikasiin user");
  }
};
