import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { NotificationType } from "@/lib/helper/enum.helper";
import { PrismaContext } from "@/server/trpc";
import {
  createCommentRequest,
  deleteCommentRequest,
  deleteReplyCommentRequest,
  editCommentRequest,
  editReplyCommentRequest,
  getReplyCommentRequest,
  replyCommentRequest,
} from "@/server/validation/comment.validation";
import { z } from "zod";
import { notifyMentionedUser } from "../notification/notification.service";

export const createComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: z.infer<typeof createCommentRequest>
) => {
  let memberGroupIds: string[] = [];

  if (input.groupPublicId !== null) {
    const isGroupMember = await prisma.group.findFirst({
      where: {
        public_id: input.groupPublicId,
      },
      select: {
        group_member: {
          select: {
            user_id: true,
          },
        },
      },
    });

    memberGroupIds =
      isGroupMember?.group_member.map((member) => member.user_id) || [];

    // Authorize user action, check if the user is member of this group
    const isUserExistInGroup = memberGroupIds.find(
      (memberId) => memberId === current_user_id
    );

    if (!isUserExistInGroup) {
      return sendTRPCResponse({
        status: 403,
        message: "Gak boleh gitu kocak",
      });
    }
  }

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

      if (current_user_id !== user_id) {
        await tx.notification.create({
          data: {
            post_id: currentPost.id,
            user_id: current_user_id,
            type: NotificationType.comment,
            is_read: false,
            to_user: user_id,
          },
        });
      }

      if (input.mention_users && input.mention_users.length > 0) {
        // Do not create double notification (on comment + on mention)
        let allowedMentionUsers = input.mention_users.filter((userId) => userId !== user_id);

        if (memberGroupIds.length > 0) {
          // Validate mentioned users, check if the each user is member of this group
          allowedMentionUsers = input.mention_users.filter((userId) =>
            memberGroupIds.find((memberId) => memberId === userId)
          );
        }

        if (allowedMentionUsers.length > 0) {
          await notifyMentionedUser(
            allowedMentionUsers,
            {
              post_id: currentPost.id,
              user_id: current_user_id,
              type: NotificationType.mention,
              is_read: false,
            },
            tx
          );
        }
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
  input: z.infer<typeof editCommentRequest>
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
          tx
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
  input: z.infer<typeof deleteCommentRequest>
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
  input: z.infer<typeof replyCommentRequest>
) => {
  const isCommentExists = await prisma.comment.findUnique({
    where: {
      id: input.comment_id,
    },
    select: {
      id: true,
      post_id: true,
      user_id: true,
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

      if (isCommentExists.user_id !== current_user_id) {
        await tx.notification.create({
          data: {
            post_id: isCommentExists.post_id,
            user_id: current_user_id,
            type: NotificationType.reply,
            is_read: false,
            to_user: isCommentExists.user_id,
            comment_id: isCommentExists.id,
          },
        });
      }

      if (input.mention_users && input.mention_users.length > 0) {
        await notifyMentionedUser(
          input.mention_users,
          {
            post_id: isCommentExists.post_id,
            user_id: current_user_id,
            type: NotificationType.mention,
            is_read: false,
          },
          tx
        );
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

export const editReplyComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: z.infer<typeof editReplyCommentRequest>
) => {
  const isCommentExists = await prisma.reply_comment.findUnique({
    where: {
      id: input.reply_comment_id,
    },
    select: {
      user_id: true,
    },
  });

  if (!isCommentExists) {
    return sendTRPCResponse({
      status: 404,
      message: "Komentar nya nggak nemu",
    });
  }

  if (isCommentExists?.user_id !== current_user_id) {
    return sendTRPCResponse({
      status: 403,
      message: "Gak boleh gitu kocak",
    });
  }

  prisma.reply_comment
    .update({
      where: {
        id: input.reply_comment_id,
      },
      data: {
        text: input.text,
      },
    })
    .catch((err) => {
      return sendTRPCResponse({
        status: 500,
        message: "Gak bisa edit reply ini",
      });
    });

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil edit reply comment",
  });
};

export const deleteReplyComment = async (
  prisma: PrismaContext,
  current_user_id: string,
  input: z.infer<typeof deleteReplyCommentRequest>
) => {
  const isCommentExists = await prisma.reply_comment.findUnique({
    where: {
      id: input.reply_comment_id,
    },
    select: {
      user_id: true,
    },
  });

  if (!isCommentExists) {
    return sendTRPCResponse({
      status: 404,
      message: "Komentar nya nggak nemu",
    });
  }

  if (isCommentExists?.user_id !== current_user_id) {
    return sendTRPCResponse({
      status: 403,
      message: "Gak boleh gitu kocak",
    });
  }

  prisma.reply_comment
    .delete({
      where: {
        id: input.reply_comment_id,
      },
    })
    .catch((err) => {
      return sendTRPCResponse({
        status: 500,
        message: "Gak bisa hapus reply ini",
      });
    });

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil hapus reply comment",
  });
};

export const getReplyComment = async (
  prisma: PrismaContext,
  input: z.infer<typeof getReplyCommentRequest>
) => {
  const replyComments = await prisma.reply_comment.findMany({
    where: {
      comment_id: input.commentId,
    },
    select: {
      id: true,
      created_at: true,
      text: true,
      user: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });

  if (replyComments.length < 1) {
    return sendTRPCResponse({
      status: 404,
      message: "Belum ada yang komentar balesan",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ok",
    },
    replyComments
  );
};
