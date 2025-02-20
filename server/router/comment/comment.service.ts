import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { PrismaContext } from "@/server/trpc";
import { notifyMentionedUser } from "../notification/notification.service";

type TInsetComment = {
  public_id: string;
  text: string;
  mention_users: string[] | null;
};

type TUpdateComment = {
  comment_id: number;
  text: string;
  mention_users: string[] | null;
};

type TReplyComment = {
  comment_id: number;
  text: string;
  mention_users: string[] | null;
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

  prisma
    .$transaction(async (tx) => {
      await tx.comment.create({
        data: {
          post_id: currentPost.id,
          user_id: current_user_id,
          text: input.text,
        },
      });

      await tx.notification.create({
        data: {
          post_id: currentPost.id,
          user_id: current_user_id,
          type: NotificationType.comment,
          is_read: false,
          to_user: user_id,
        },
      });

      if (input.mention_users && input.mention_users.length > 0) {
        await notifyMentionedUser(
          input.mention_users,
          {
            post_id: currentPost.id,
            user_id: current_user_id,
            type: NotificationType.mention,
            is_read: false,
          },
          tx,
        );
      }
    })
    .catch((err) => {
      return sendTRPCResponse({
        status: 500,
        message: "Gak bisa mengomentari postingan ini",
      });
    });

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
      post_id: true,
    },
  });

  if (currentComment?.user_id !== current_user_id) {
    return sendTRPCResponse({
      status: 405,
      message: "Gak usah aneh aneh deh",
    });
  }

  prisma
    .$transaction(async (tx) => {
      await tx.comment.update({
        where: {
          id: input.comment_id,
        },
        data: {
          text: input.text,
        },
      });

      if (input.mention_users && input.mention_users.length > 0) {
        await notifyMentionedUser(
          input.mention_users,
          {
            post_id: currentComment.post_id,
            user_id: current_user_id,
            type: NotificationType.mention,
            is_read: false,
          },
          tx,
        );
      }
    })
    .catch((err) => {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal merubah komentar nya bre",
      });
    });

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil mengubah komentar nya",
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
      message: "Gagal menghapus komentar",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil menghapus komentar",
  });
};

export const replyComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: TReplyComment,
) => {
  const isCommentExists = await prisma.comment.findUnique({
    where: {
      id: input.comment_id,
    },
  });

  if (!isCommentExists) {
    return sendTRPCResponse({
      status: 404,
      message: "Komentar nya nggak nemu",
    });
  }

  prisma
    .$transaction(async (tx) => {
      await tx.reply_comment.create({
        data: {
          text: input.text,
          comment_id: input.comment_id,
          user_id: current_user_id,
        },
      });

      await tx.notification.create({
        data: {
          post_id: isCommentExists.post_id,
          user_id: current_user_id,
          type: NotificationType.reply,
          is_read: false,
          to_user: isCommentExists.user_id,
        },
      });

      if (input.mention_users && input.mention_users.length > 0) {
        notifyMentionedUser(input.mention_users, {
          post_id: isCommentExists.post_id,
          user_id: current_user_id,
          type: NotificationType.mention,
          is_read: false,
        });
      }
    })
    .catch((err) => {
      return sendTRPCResponse({
        status: 500,
        message: "Gak bisa reply komentar ini",
      });
    });

  return sendTRPCResponse({
    status: 201,
    message: "Komentar berhasil di reply",
  });
};
