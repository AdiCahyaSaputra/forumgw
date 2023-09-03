import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { generateAnonymousRandomString } from "@/lib/helper/str.helper";
import { PrismaContext } from "@/server/trpc";

// Update or inSert
type TUpSertPost = {
  content: string;
  categoryId: "1" | "2";
  userId: string;
};

export const getFeedByCategory = async (
  prisma: PrismaContext,
  categoryId: string
) => {
  const existingPosts = await prisma.post.findMany({
    where: { categoryId: +categoryId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      Anonymous: {
        select: {
          id: true,
          username: true,
        },
      },
      Comment: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!existingPosts.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Postingan masih kosong bre",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Semua postingan berdasarkan Kategory",
    },
    existingPosts
  );
};

export const getReportedPost = async (prisma: PrismaContext) => {
  const reportedPosts = await prisma.post.findMany({
    where: {
      reportedId: {
        not: null,
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      Anonymous: {
        select: {
          id: true,
          username: true,
        },
      },
      Reported: {
        select: {
          id: true,
          reason: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!reportedPosts.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Tidak ada postingan yang dilaporkan",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Semua data postingan yang dilaporkan",
    },
    reportedPosts
  );
};

export const getUserPosts = async (
  prisma: PrismaContext,
  userId: string,
  withAnonymousPosts: boolean,
  withComments: boolean
) => {
  let anonymousUser = null;

  if (withAnonymousPosts) {
    anonymousUser = await prisma.anonymous.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
  }

  const existingPosts = await prisma.post.findMany({
    where: {
      OR: [{ userId }, { anonymousId: anonymousUser?.id }],
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      Anonymous: withAnonymousPosts && {
        select: {
          id: true,
          username: true,
        },
      },
      Comment: withComments && {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
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
      message: "Semua postingan yangn orang ini posting",
    },
    existingPosts
  );
};

export const getDetailedPost = async (
  prisma: PrismaContext,
  postId: string
) => {
  const existingPostWithComments = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      Anonymous: {
        select: {
          id: true,
          username: true,
        },
      },
      Comment: {
        select: {
          id: true,
          text: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
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

export const createPost = async (
  prisma: PrismaContext,
  data: TUpSertPost,
  isAnonymousPost: boolean
) => {
  if (isAnonymousPost) {
    let anonymousId: string | null = null;

    const existingAnonymousUser = await prisma.anonymous.findUnique({
      where: { userId: data.userId },
    });

    if (!existingAnonymousUser) {
      const createdAnonymousUser = await prisma.anonymous.create({
        data: {
          userId: data.userId,
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
        anonymousId: anonymousId,
        categoryId: +data.categoryId,
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
      userId: data.userId,
      categoryId: +data.categoryId,
    },
  });

  if (!createdPublicPost) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal membuat postingan Public",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Berhasil membuat postingan Public",
    },
    createdPublicPost
  );
};

export const updatePost = async (
  prisma: PrismaContext,
  postId: string,
  data: TUpSertPost,
  visibilityTo: "anonymous" | "public"
) => {
  if (visibilityTo === "anonymous") {
    let anonymousId = null;

    const existingAnonymousUser = await prisma.anonymous.findUnique({
      where: {
        userId: data.userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingAnonymousUser) {
      const createdAnonymousUser = await prisma.anonymous.create({
        data: {
          userId: data.userId,
          username: "si-" + generateAnonymousRandomString(4),
        },
      });

      if (!createdAnonymousUser) {
        return sendTRPCResponse({
          status: 400,
          message: "Gagal mengubah postingan",
        });
      }

      anonymousId = createdAnonymousUser.id;
    } else {
      anonymousId = existingAnonymousUser.id;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content: data.content,
        categoryId: +data.categoryId,
        userId: null,
        anonymousId,
      },
    });

    if (!updatedPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal mengubah postingan",
      });
    }

    return sendTRPCResponse(
      {
        status: 201,
        message: "Berhasil mengubah postingan",
      },
      updatedPost
    );
  }

  if (visibilityTo === "public") {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content: data.content,
        categoryId: +data.categoryId,
        userId: data.userId,
        anonymousId: null,
      },
    });

    if (!updatedPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal mengubah postingan",
      });
    }

    return sendTRPCResponse(
      {
        status: 201,
        message: "Berhasil mengubah postingan",
      },
      updatedPost
    );
  }

  return sendTRPCResponse({
    status: 403,
    message: "Lu salah masukin data",
  });
};

export const deletePost = async (prisma: PrismaContext, postId: string) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  if (!deletedPost) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal menghapus data postingan",
    });
  }

  return sendTRPCResponse(
    {
      status: 201,
      message: "Postingan lu berhasil gue delete",
    },
    deletedPost
  );
};
