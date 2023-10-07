import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { PrismaContext } from "@/server/trpc";

type TInsetComment = {
  public_id: string;
  text: string;
};

type TUpdateComment = {
  comment_id: number;
  text: string;
};

export const createComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: TInsetComment,
) => {
  const currentPost = await prisma.post.findUnique({
    where: {
      public_id: input.public_id,
    },
    select: {
      id: true,
      user_id: true,
      anonymous: {
        select: {
          user_id: true,
        },
      },
    },
  });

  let user_id = "";

  if (!currentPost) {
    return sendTRPCResponse({
      status: 404,
      message: "Gak usah aneh aneh deh",
    });
  }

  if (!currentPost.user_id) {
    if (!currentPost.anonymous) {
      return sendTRPCResponse({
        status: 404,
        message: "Gak usah aneh aneh deh",
      });
    } else {
      user_id = currentPost.anonymous.user_id;
    }
  } else {
    user_id = currentPost.user_id;
  }

  const createdComment = await prisma.$transaction([
    prisma.comment.create({
      data: {
        post_id: currentPost.id,
        user_id: current_user_id,
        text: input.text,
      },
    }),
    prisma.notification.create({
      data: {
        post_id: currentPost.id,
        user_id: current_user_id,
        type: NotificationType.comment,
        is_read: false,
        to_user: user_id,
      },
    }),
  ]);

  if (!createdComment) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal mengomentari postingan ini",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil mengomentari postingan ini",
  });
};

export const editComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: TUpdateComment,
) => {
  const currentComment = await prisma.comment.findUnique({
    where: {
      id: input.comment_id,
    },
    select: {
      user_id: true,
    },
  });

  if (currentComment?.user_id !== current_user_id) {
    return sendTRPCResponse({
      status: 405,
      message: "Gak usah aneh aneh deh",
    });
  }

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

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil mengubah komentar lu",
  });
};

export const deleteComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: { comment_id: number },
) => {
  const currentComment = await prisma.comment.findUnique({
    where: {
      id: input.comment_id,
    },
    select: {
      user_id: true,
    },
  });

  if (currentComment?.user_id !== current_user_id) {
    return sendTRPCResponse({
      status: 405,
      message: "Gak usah aneh aneh deh",
    });
  }

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
