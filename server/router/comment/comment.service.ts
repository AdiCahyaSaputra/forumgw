import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { excludeField } from "@/lib/helper/obj.helper";
import { PrismaContext } from "@/server/trpc";

type TInsetComment = {
  post_id: string;
  user_id: string;
  text: string;
  author_id: string;
};

type TUpdateComment = {
  comment_id: number;
  text: string;
};

export const createComment = async (
  prisma: PrismaContext,
  input: TInsetComment,
) => {
  const data = excludeField(input, ["author_id"]);

  const createdComment = await prisma.$transaction([
    prisma.comment.create({
      data,
    }),
    prisma.notification.create({
      data: {
        post_id: input.post_id,
        user_id: input.user_id,
        type: NotificationType.comment,
        is_read: false,
        to_user: input.author_id,
      },
    }),
  ]);

  if (!createdComment) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal mengomentari postingan ini",
    });
  }

  return sendTRPCResponse(
    {
      status: 201,
      message: "Berhasil mengomentari postingan ini",
    },
    createdComment,
  );
};

export const editComment = async (
  prisma: PrismaContext,
  input: TUpdateComment,
) => {
  const editedComment = await prisma.comment.update({
    where: {
      id: input.comment_id,
    },
    data: {
      text: input.text,
    },
  });

  if (!editedComment) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal merubah komentar lu bre",
    });
  }

  return sendTRPCResponse(
    {
      status: 201,
      message: "Berhasil mengubah komentar lu",
    },
    editedComment,
  );
};

export const deleteComment = async (
  prisma: PrismaContext,
  input: { comment_id: number },
) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: input.comment_id,
    },
  });

  if (!deletedComment) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal menghapus komentar lu",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil menghapus komentar",
  });
};
