import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { PrismaContext } from "@/server/trpc";

type TInsetComment = {
  postId: string;
  userId: string;
  text: string;
};

type TUpdateComment = {
  commentId: number;
  text: string;
};

export const createComment = async (
  prisma: PrismaContext,
  input: TInsetComment
) => {
  const createdComment = await prisma.comment.create({
    data: input,
  });

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
    createdComment
  );
};

export const editComment = async (
  prisma: PrismaContext,
  input: TUpdateComment
) => {
  const editedComment = await prisma.comment.update({
    where: {
      id: input.commentId,
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
    editedComment
  );
};

export const deleteComment = async (
  prisma: PrismaContext,
  input: { commentId: number }
) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: input.commentId,
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
