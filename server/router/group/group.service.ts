import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { PrismaContext } from "@/server/trpc";
import { send } from "process";

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
