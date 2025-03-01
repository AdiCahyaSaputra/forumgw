import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { generateAnonymousRandomString } from "@/lib/helper/str.helper";
import { PrismaContext } from "@/server/trpc";
import {
  acceptOrDeclineInviteRequest,
  acceptOrDeclineJoinRequestValidation,
  createGroupPostRequest,
  createGroupRequest,
  deleteGroupRequest,
  editGroupRequest,
  getDetailedGroupPostRequest,
  getGroupPostByAuthorRequest,
} from "@/server/validation/group.validation";
import { user } from "@prisma/client";
import { z } from "zod";

export const getAllGroupByUser = async (
  prisma: PrismaContext,
  user_id: string
) => {
  const group = await prisma.group_member.findMany({
    where: {
      user_id,
    },
    select: {
      group: {
        select: {
          public_id: true,
          name: true,
          description: true,
          logo: true,
        },
      },
    },
  });

  if (!group.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Kamu belom punya sirkel!",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih bre semua sirkel nya",
    },
    group
  );
};

export const createGroup = async (
  prisma: PrismaContext,
  data: z.infer<typeof createGroupRequest>,
  leader_id: string
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const { name, description, invitedUsername } = data;

      const createdGroup = await tx.group.create({
        data: {
          name,
          description,
          leader_id,
        },
      });

      await tx.group_member.create({
        data: {
          group_id: createdGroup.id,
          user_id: leader_id,
        },
      });

      if (invitedUsername?.length) {
        const invitedUsers = await tx.user.findMany({
          where: {
            username: {
              in: invitedUsername,
            },
          },
        });

        const data = invitedUsers.map((user) => ({
          group_id: createdGroup.id,
          user_id: user.id,
        }));

        await tx.group_invitation.createMany({
          data,
        });
      }
    });

    return sendTRPCResponse({
      status: 201,
      message: "Sirkel nya udah berhasil di buat",
    });
  } catch (error) {
    return sendTRPCResponse({
      status: 400,
      message: "Sirkel nya gagal di buat",
    });
  }
};

export const getGroupInvitation = async (
  prisma: PrismaContext,
  user_id: string
) => {
  const invitations = await prisma.group_invitation.findMany({
    where: {
      user_id,
    },
    select: {
      id: true,
      group: {
        select: {
          id: true,
          name: true,
          description: true,
          leader: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (!invitations.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Gaada undangan buat join sirkel",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ada undangan ni bre",
    },
    invitations
  );
};

export const acceptOrDeclineInvite = async (
  prisma: PrismaContext,
  data: z.infer<typeof acceptOrDeclineInviteRequest>,
  user_id: string
) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.group_invitation.delete({
        where: {
          id: data.invite_id,
        },
      });

      if (data.type === "accept") {
        await tx.group_member.create({
          data: {
            group_id: data.group_id,
            user_id,
          },
        });
      }
    });

    const message = {
      accept: "Selamat bergabung bro",
      decline: "Ya sayang banget bang",
    };

    return sendTRPCResponse({
      status: 204,
      message: message[data.type],
    });
  } catch (err) {
    const message = {
      accept: "Gagal join sirkel",
      decline: "Gagal nolak undangan join",
    };

    return sendTRPCResponse({
      status: 400,
      message: message[data.type],
    });
  }
};

export const getGroupByQuery = async (
  prisma: PrismaContext,
  user_id: string,
  searchTerm: string | null
) => {
  if (searchTerm) {
    const groups = await prisma.group.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      select: {
        public_id: true,
        name: true,
        description: true,
        leader: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        group_member: {
          select: {
            user_id: true,
          },
        },
        _count: {
          select: {
            group_member: true,
          },
        },
      },
    });

    if (!groups.length) {
      return sendTRPCResponse({
        status: 404,
        message: "Sirkel nya gk ketemu bre",
      });
    }

    const data = groups.map((group) => {
      const { public_id, name, description, leader, _count, group_member } =
        group;

      return {
        public_id,
        name,
        description,
        leader,
        _count,
        isMember: group_member.some((member) => member.user_id === user_id),
      };
    });

    return sendTRPCResponse(
      {
        status: 200,
        message: "Nih sirkel nya bre",
      },
      data
    );
  }

  const groups = await prisma.group.findMany({
    select: {
      public_id: true,
      name: true,
      description: true,
      leader: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
      group_member: {
        select: {
          user_id: true,
        },
      },
      _count: {
        select: {
          group_member: true,
        },
      },
    },
    orderBy: {
      group_member: {
        _count: "desc",
      },
    },
  });

  if (!groups.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel masih kosong",
    });
  }

  const data = groups.map((group) => {
    const { public_id, name, description, leader, _count, group_member } =
      group;

    return {
      public_id,
      name,
      description,
      leader,
      _count,
      isMember: group_member.some((member) => member.user_id === user_id),
    };
  });

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih sirkel nya bre",
    },
    data
  );
};

export const getGroupByPublicId = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id,
    },
    select: {
      public_id: true,
      name: true,
      description: true,
      leader: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      group_member: {
        select: {
          user_id: true,
        },
      },
      _count: {
        select: {
          group_member: true,
        },
      },
      post: {
        select: {
          public_id: true,
          content: true,
          created_at: true,
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
          anonymous: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel nya gk ketemu",
    });
  }

  const groupWithAccess: typeof group & {
    isMember: boolean;
    isLeader: boolean;
  } = {
    ...group,
    isMember: !!group.group_member.filter(
      ({ user_id: member_user_id }) => member_user_id === user_id
    ).length,
    isLeader: group.leader.id === user_id,
  };

  const data = {
    public_id: groupWithAccess.public_id,
    name: groupWithAccess.name,
    description: groupWithAccess.description,
    leader: {
      name: groupWithAccess.leader.name,
      username: groupWithAccess.leader.username,
      image: groupWithAccess.leader.image,
    },
    _count: {
      group_member: groupWithAccess._count.group_member,
    },
    post: groupWithAccess.post,
    isMember: groupWithAccess.isMember,
    isLeader: groupWithAccess.isLeader,
  };

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih bre sirkel dan post nya",
    },
    data
  );
};

export const createGroupPost = async (
  prisma: PrismaContext,
  data: z.infer<typeof createGroupPostRequest> & { user_id: user["id"] },
  isAnonymousPost: boolean
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id: data.group_public_id,
    },
    select: {
      id: true,
      group_member: {
        where: {
          user_id: data.user_id,
        },
      },
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal membuat postingan",
    });
  }

  if (!group?.group_member.length) {
    return sendTRPCResponse({
      status: 400,
      message: "Kamu hengker terbaik di bumi",
    });
  }

  if (isAnonymousPost) {
    let anonymousId: string | null = null;

    const existingAnonymousUser = await prisma.anonymous.findUnique({
      where: { user_id: data.user_id },
    });

    if (!existingAnonymousUser) {
      const createdAnonymousUser = await prisma.anonymous.create({
        data: {
          user_id: data.user_id,
          username: "si-" + generateAnonymousRandomString(4),
        },
      });

      if (!createdAnonymousUser) {
        return sendTRPCResponse({
          status: 400,
          message: "Gagal membuat postingan Anonymous",
        });
      }

      anonymousId = createdAnonymousUser.id;
    } else {
      anonymousId = existingAnonymousUser.id;
    }

    const createdAnonymousPost = await prisma.post.create({
      data: {
        content: data.content,
        anonymous_id: anonymousId,
        category_id: 3,
        group_id: group.id,
      },
    });

    if (!createdAnonymousPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal membuat postingan Anonymous",
      });
    }

    return sendTRPCResponse({
      status: 200,
      message: "Berhasil membuat postingan Anonymous",
    });
  }

  const createdPublicPost = await prisma.post.create({
    data: {
      content: data.content,
      user_id: data.user_id,
      category_id: 3,
      group_id: group.id,
    },
  });

  if (!createdPublicPost) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal membuat postingan Public",
    });
  }

  return sendTRPCResponse({
    status: 200,
    message: "Berhasil membuat postingan Public",
  });
};

export const getDetailedGroupPost = async (
  prisma: PrismaContext,
  data: z.infer<typeof getDetailedGroupPostRequest> & { user_id: user["id"] }
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id: data.public_group_id,
    },
    select: {
      id: true,
      group_member: {
        where: {
          user_id: data.user_id,
        },
      },
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Gagal membuat postingan",
    });
  }

  if (!group?.group_member.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Kamu hengker terbaik di bumi",
    });
  }

  const existingPostWithComments = await prisma.post.findUnique({
    where: {
      public_id: data.public_post_id,
    },
    select: {
      public_id: true,
      content: true,
      created_at: true,
      user: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      anonymous: {
        select: {
          username: true,
        },
      },
      tag_post: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      comments: {
        select: {
          id: true,
          text: true,
          created_at: true,
          user: {
            select: {
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              reply_comment: true
            }
          }
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!existingPostWithComments) {
    return sendTRPCResponse({
      status: 404,
      message: "Postingan ini sebenernya gk ada",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Postingan beserta komentar nya",
    },
    existingPostWithComments
  );
};

export const getGroupPostByAuthor = async (
  prisma: PrismaContext,
  data: z.infer<typeof getGroupPostByAuthorRequest>,
  user_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id: data.group_public_id,
    },
    select: {
      id: true,
      group_member: {
        where: {
          user_id,
        },
      },
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Gagal membuat postingan",
    });
  }

  if (!group?.group_member.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Kamu hengker terbaik di bumi",
    });
  }

  let anonymousUser = null;

  if (data.withAnonymousPosts) {
    anonymousUser = await prisma.anonymous.findUnique({
      where: {
        user_id,
      },
      select: {
        id: true,
      },
    });
  }

  const existingPosts = await prisma.post.findMany({
    where: {
      OR: [{ user_id }, { anonymous_id: anonymousUser?.id }],
      category_id: 3,
    },
    select: {
      id: true,
      content: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      anonymous: data.withAnonymousPosts && {
        select: {
          id: true,
          username: true,
        },
      },
      tag_post: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!existingPosts.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Orang ini belom pernah posting apapun",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Semua postingan yang orang ini posting",
    },
    existingPosts
  );
};

export const editGroup = async (
  prisma: PrismaContext,
  data: z.infer<typeof editGroupRequest> & { user_id: user["id"] }
) => {
  const group = await prisma.group.findFirst({
    where: {
      AND: [
        {
          public_id: data.group_public_id,
          leader_id: data.user_id,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 401,
      message: "Kamu hengker terbaik di bumi",
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const { name, description, invitedUsername, logo } = data.update_data;

      if (invitedUsername?.length) {
        const invitedUsers = await tx.user.findMany({
          where: {
            username: {
              in: invitedUsername,
            },
          },
        });

        const groupMember = await tx.group_member.findMany({
          where: {
            group_id: group.id,
          },
          select: {
            user_id: true,
          },
        });

        const kickedMember = groupMember
          .filter(
            ({ user_id }) => !invitedUsers.some((user) => user_id === user.id)
          )
          .map((user) => user.user_id);

        if (kickedMember.length) {
          await tx.group_member.deleteMany({
            where: {
              AND: [
                {
                  group_id: group.id,
                  user_id: {
                    in: kickedMember,
                  },
                },
              ],
            },
          });
        }

        const data = invitedUsers.map((user) => {
          const isAlreadyMember = !!groupMember.find(
            (member) => member.user_id === user.id
          );

          return {
            group_id: group.id,
            user_id: user.id,
            isAlreadyMember,
          };
        });

        const inviteUsersData = data
          .filter((user) => !user.isAlreadyMember)
          .map((user) => ({
            group_id: user.group_id,
            user_id: user.user_id,
          }));

        await tx.group_invitation.createMany({
          data: inviteUsersData,
        });
      }

      await tx.group.update({
        where: {
          id: group.id,
        },
        data: {
          name,
          description,
          logo,
        },
      });
    });

    return sendTRPCResponse({
      status: 201,
      message: "Sirkel nya berhasil di edit",
    });
  } catch (err) {
    console.log(err);

    return sendTRPCResponse({
      status: 400,
      message: "Sirkel nya gagal di edit",
    });
  }
};

export const deleteGroup = async (
  prisma: PrismaContext,
  data: z.infer<typeof deleteGroupRequest> & { user_id: user["id"] }
) => {
  const group = await prisma.group.findFirst({
    where: {
      AND: [
        {
          public_id: data.group_public_id,
          leader_id: data.user_id,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 401,
      message: "Lu hengker terbaik di bumi banh",
    });
  }

  const deletedGroup = await prisma.group.delete({
    where: {
      id: group.id,
    },
  });

  if (!deletedGroup) {
    return sendTRPCResponse({
      status: 400,
      message: "Sirkel nya gabisa ke hapus wkwkwk",
    });
  }

  return sendTRPCResponse({
    status: 200,
    message: "Sirkel nya udah di hapus",
  });
};

export const getGroupByAuthor = async (
  prisma: PrismaContext,
  user_id: string
) => {
  const groups = await prisma.group.findMany({
    where: {
      leader_id: user_id,
    },
    select: {
      public_id: true,
      name: true,
      description: true,
      logo: true,
      _count: {
        select: {
          group_member: true,
        },
      },
    },
  });

  if (!groups.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Kamu belom bikin sirkel",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ni semua sirkel kamu",
    },
    groups
  );
};

export const getDetailedGroupMemberByPublicId = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      AND: [
        {
          leader_id: user_id,
          public_id,
        },
      ],
    },
    select: {
      public_id: true,
      name: true,
      description: true,
      logo: true,
      group_member: {
        select: {
          user: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel nya gk ketemu banh",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ni sirkel kamu",
    },
    group
  );
};

export const askToJoinGroup = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id,
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel nya gk ketemu banh",
    });
  }

  const alreadyRequested = await prisma.group_join_request.findFirst({
    where: {
      AND: [
        {
          group_id: group.id,
          user_id,
        },
      ],
    },
  });

  if (alreadyRequested) {
    return sendTRPCResponse({
      status: 400,
      message: "Sabar bre leader nya slow respon bjir",
    });
  }

  const alreadyMember = await prisma.group_member.findFirst({
    where: {
      group_id: group.id,
      user_id,
    },
    select: {
      id: true,
    },
  });

  if (alreadyMember) {
    return sendTRPCResponse({
      status: 400,
      message: "Kamu udh jadi member ngapain daftar",
    });
  }

  const createdJoinRequest = await prisma.group_join_request.create({
    data: {
      group_id: group.id,
      user_id,
    },
  });

  if (!createdJoinRequest) {
    return sendTRPCResponse({
      status: 400,
      message: "Duh ga bisa bikinin join request bre",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Sip, lagi follow up dulu ke leader nya entar",
  });
};

export const getGroupJoinRequest = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      AND: [
        {
          public_id,
          leader_id: user_id,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel gk ketemu atau kamu bukan leader",
    });
  }

  const requestedUsers = await prisma.group_join_request.findMany({
    where: {
      group_id: group.id,
    },
    select: {
      id: true,
      group_id: true,
      user: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!requestedUsers.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Ga ada yang minta join sih sejauh ini",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih data user yg mau join",
    },
    requestedUsers
  );
};

export const acceptOrDeclineJoinRequest = async (
  prisma: PrismaContext,
  data: z.infer<typeof acceptOrDeclineJoinRequestValidation>,
  user_id: string
) => {
  const isLeader = await prisma.group.findFirst({
    where: {
      id: data.group_id,
      leader_id: user_id,
    },
    select: {
      leader_id: true,
    },
  });

  if (!isLeader) {
    return sendTRPCResponse({
      status: 401,
      message: "Wah lu hengker ya bang",
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const joinRequest = await tx.group_join_request.findUnique({
        where: {
          id: data.request_id,
        },
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!joinRequest) {
        return sendTRPCResponse({
          status: 401,
          message: "Lho kamu siapa",
        });
      }

      if (data.type === "accept") {
        await tx.group_member.create({
          data: {
            group_id: data.group_id,
            user_id: joinRequest.user.id,
          },
        });

        await tx.group_join_request.delete({
          where: {
            id: data.request_id,
          },
        });
      }
    });

    const message = {
      accept: "Ok tu anak lagi panggil",
      decline: "Wkwkwk yaudh",
    };

    return sendTRPCResponse({
      status: 204,
      message: message[data.type],
    });
  } catch (err) {
    const message = {
      accept: "Gagal join sirkel",
      decline: "Gagal nolak request join",
    };

    return sendTRPCResponse({
      status: 400,
      message: message[data.type],
    });
  }
};

export const exitFromGroup = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string
) => {
  const group = await prisma.group.findFirst({
    where: {
      public_id,
    },
    select: {
      id: true,
    },
  });

  if (!group) {
    return sendTRPCResponse({
      status: 404,
      message: "Sirkel gk ketemu",
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const groupMember = await tx.group_member.findFirst({
        where: {
          AND: {
            group_id: group.id,
            user_id,
          },
        },
        select: {
          id: true,
        },
      });

      await tx.group_member.delete({
        where: {
          id: groupMember?.id,
        },
      });
    });

    return sendTRPCResponse({
      status: 200,
      message: "Good Bye bre",
    });
  } catch (err) {
    return sendTRPCResponse({
      status: 500,
      message: "Gagal keluar dari group wkwkwk",
    });
  }
};
