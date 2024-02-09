import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { generateAnonymousRandomString } from "@/lib/helper/str.helper";
import { PrismaContext } from "@/server/trpc";

type TUpsertGroup = {
  name: string;
  description: string;
  invitedUsername: string[] | null;
};

type TAcceptOrDeclineInvite = {
  type: "accept" | "decline";
  invite_id: number;
  group_id: string;
};

type TUpSertPost = {
  user_id: string;
  group_public_id: string;
  content: string;
};

type TDetailPostArg = {
  public_group_id: string;
  public_post_id: string;
  user_id: string;
};

export const getAllGroupByUser = async (
  prisma: PrismaContext,
  user_id: string,
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
          logo: true,
        },
      },
    },
  });

  if (!group.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Lu belom punya sirkel bre!",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih bre semua sirkel lu",
    },
    group,
  );
};

export const createGroup = async (
  prisma: PrismaContext,
  data: TUpsertGroup,
  leader_id: string,
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
      message: "Sirkel lu udah gue bikin",
    });
  } catch (error) {
    return sendTRPCResponse({
      status: 400,
      message: "Sirkel lu gagal gue bikin",
    });
  }
};

export const getGroupInvitation = async (
  prisma: PrismaContext,
  user_id: string,
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
    invitations,
  );
};

export const acceptOrDeclineInvite = async (
  prisma: PrismaContext,
  data: TAcceptOrDeclineInvite,
  user_id: string,
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
  searchTerm: string | null,
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

    return sendTRPCResponse(
      {
        status: 200,
        message: "Nih sirkel nya bre",
      },
      groups,
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

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih sirkel nya bre",
    },
    groups,
  );
};

export const getGroupByPublicId = async (
  prisma: PrismaContext,
  user_id: string,
  public_id: string,
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
      ({ user_id: member_user_id }) => member_user_id === user_id,
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
    data,
  );
};

export const createGroupPost = async (
  prisma: PrismaContext,
  data: TUpSertPost,
  isAnonymousPost: boolean,
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
      message: "Lu hengker terbaik di bumi banh",
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
  data: TDetailPostArg,
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
      message: "Lu hengker terbaik di bumi banh",
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
    existingPostWithComments,
  );
};
