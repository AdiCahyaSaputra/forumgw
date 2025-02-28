import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { generateAnonymousRandomString } from "@/lib/helper/str.helper";
import Tag from "@/lib/interface/Tag";
import { PrismaContext } from "@/server/trpc";

// Update or inSert
type TUpSertPost = {
  user_id: string;
  content: string;
  category_id: "1" | "2";
  tags: Tag[];
};

export const getAllOrSpecificTags = async (
  prisma: PrismaContext,
  tag_ids: string[],
  tag_names: string,
) => {
  if (tag_ids.length > 0) {
    const tags = await prisma.tag.findMany({
      take: 5,
      where: {
        id: {
          in: tag_ids.map((id) => +id),
        },
      },
    });

    return sendTRPCResponse(
      {
        status: 200,
        message: "Ok",
      },
      tags
    );
  }

  if (tag_names.length > 0) {
    const tags = await prisma.tag.findMany({
      take: 5,
      where: {
        name: {
          contains: tag_names,
          mode: 'insensitive'
        },
      },
    });

    return sendTRPCResponse(
      {
        status: 200,
        message: "Ok",
      },
      tags
    );
  }

  const tags = await prisma.tag.findMany({
    take: 5,
  });

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ok",
    },
    tags
  );
};

export const getFeedByCategory = async (
  prisma: PrismaContext,
  category_id: string,
  tag_ids: string[],
  cursor?: string | null
) => {
  if (+category_id === 3) {
    return sendTRPCResponse({
      status: 404,
      message: "Halo hengkerr",
    });
  }

  const limit = 10;

  const whereClause: any[] = [
    {
      category_id: +category_id,
    },
  ];

  if (!!tag_ids.length) {
    whereClause.push({
      tag_post: {
        some: {
          tag_id: {
            in: tag_ids.map((id) => +id),
          },
        },
      },
    });
  }

  const existingPosts = await prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { public_id: cursor } : undefined,
    where: {
      AND: whereClause,
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
      message: "Postingan masih kosong bre",
    });
  }

  let nextCursor: string | null = null;

  if (existingPosts.length > limit) {
    const nextPost = existingPosts.pop();

    nextCursor = nextPost!.public_id;
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Semua postingan berdasarkan Kategory",
    },
    {
      posts: existingPosts,
      cursor: nextCursor,
    }
  );
};

export const getPostReportedReasons = async (
  prisma: PrismaContext,
  post_id: string
) => {
  const reasons = await prisma.report.findMany({
    where: {
      post_id,
    },
    select: {
      id: true,
      reason: true,
    },
  });

  if (!reasons.length) {
    return sendTRPCResponse({
      status: 404,
      message: "Aman kok bang",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih alasan nya",
    },
    reasons
  );
};

export const getReportedPost = async (prisma: PrismaContext) => {
  const reportedPosts = await prisma.report.findMany({
    select: {
      id: true,
      reason: true,
      post: {
        select: {
          id: true,
          content: true,
          created_at: true,
          user: {
            select: {
              username: true,
              name: true,
              image: true,
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
          anonymous: {
            select: {
              username: true,
            },
          },
        },
      },
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
  user_id: string,
  withAnonymousPosts: boolean
) => {
  let anonymousUser = null;

  if (withAnonymousPosts) {
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
      NOT: {
        category_id: 3,
      },
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
      anonymous: withAnonymousPosts && {
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

export const getDetailedPost = async (
  prisma: PrismaContext,
  public_id: string
) => {
  const existingPostWithComments = await prisma.post.findUnique({
    where: {
      public_id,
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

export const createTag = async (
  prisma: PrismaContext,
  data: { name: string }
) => {
  const createdTag = await prisma.tag.create({ data });

  if (!createdTag) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal membuat tag baru",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Tag baru nya udah di bikin",
  }, createdTag);
};

export const createPost = async (
  prisma: PrismaContext,
  data: TUpSertPost,
  isAnonymousPost: boolean
) => {
  return prisma.$transaction(async (tx) => {
    if (isAnonymousPost) {
      let anonymousId: string | null = null;

      const existingAnonymousUser = await tx.anonymous.findUnique({
        where: { user_id: data.user_id },
      });

      if (!existingAnonymousUser) {
        const createdAnonymousUser = await tx.anonymous.create({
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

      const createdAnonymousPost = await tx.post.create({
        data: {
          content: data.content,
          anonymous_id: anonymousId,
          category_id: +data.category_id,
        },
      });

      if (!createdAnonymousPost) {
        return sendTRPCResponse({
          status: 400,
          message: "Gagal membuat postingan Anonymous",
        });
      }

      if (data.tags.length > 0) {
        const tagsOnPost = data.tags.map((tag) => {
          return {
            tag_id: tag.id,
            post_id: createdAnonymousPost.id,
          };
        });

        await tx.tag_post.createMany({
          data: tagsOnPost,
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
        category_id: +data.category_id,
      },
    });

    if (!createdPublicPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal membuat postingan Public",
      });
    }

    if (data.tags.length > 0) {
      const tagsOnPost = data.tags.map((tag) => {
        return {
          tag_id: tag.id,
          post_id: createdPublicPost.id,
        };
      });

      await tx.tag_post.createMany({
        data: tagsOnPost,
      });
    }

    return sendTRPCResponse({
      status: 200,
      message: "Berhasil membuat postingan Public",
    });
  });
};

export const updatePost = async (
  prisma: PrismaContext,
  post_id: string,
  data: Omit<TUpSertPost, "category_id">,
  visibilityTo: "anonymous" | "public"
) => {
  return prisma.$transaction(async (tx) => {
    if (visibilityTo === "anonymous") {
      let anonymous_id = null;

      const existingAnonymousUser = await tx.anonymous.findUnique({
        where: {
          user_id: data.user_id,
        },
        select: {
          id: true,
        },
      });

      if (!existingAnonymousUser) {
        const createdAnonymousUser = await tx.anonymous.create({
          data: {
            user_id: data.user_id,
            username: "si-" + generateAnonymousRandomString(4),
          },
        });

        if (!createdAnonymousUser) {
          return sendTRPCResponse({
            status: 400,
            message: "Gagal mengubah postingan",
          });
        }

        anonymous_id = createdAnonymousUser.id;
      } else {
        anonymous_id = existingAnonymousUser.id;
      }

      const updatedPost = await prisma.post.update({
        where: { id: post_id },
        data: {
          content: data.content,
          user_id: null,
          anonymous_id,
        },
      });

      if (!updatedPost) {
        return sendTRPCResponse({
          status: 400,
          message: "Gagal mengubah postingan",
        });
      }

      if (data.tags) {
        await tx.tag_post.deleteMany({
          where: {
            post_id: post_id,
          },
        });

        const tagsOnPost = data.tags.map((tag) => {
          return {
            tag_id: tag.id,
            post_id: post_id,
          };
        });

        await tx.tag_post.createMany({
          data: tagsOnPost,
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
      const updatedPost = await tx.post.update({
        where: {
          id: post_id,
        },
        data: {
          content: data.content,
          user_id: data.user_id,
          anonymous_id: null,
        },
      });

      if (!updatedPost) {
        return sendTRPCResponse({
          status: 400,
          message: "Gagal mengubah postingan",
        });
      }

      if (data.tags) {
        await tx.tag_post.deleteMany({
          where: {
            post_id: post_id,
          },
        });

        const tagsOnPost = data.tags.map((tag) => {
          return {
            tag_id: tag.id,
            post_id: post_id,
          };
        });

        await tx.tag_post.createMany({
          data: tagsOnPost,
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
      message: "Kamu salah masukin data",
    });
  });
};

export const deletePost = async (prisma: PrismaContext, post_id: string) => {
  return prisma.$transaction(async (tx) => {
    const deletedPost = await tx.post.delete({
      where: {
        id: post_id,
      },
    });

    if (!deletedPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal menghapus data postingan",
      });
    }

    await tx.tag_post.deleteMany({
      where: {
        post_id: post_id,
      },
    });

    return sendTRPCResponse(
      {
        status: 201,
        message: "Postingan nya berhasil di hapus",
      },
      deletedPost
    );
  });
};

export const reportPost = async (
  prisma: PrismaContext,
  public_id: string,
  reason: string
) => {
  const post = await prisma.post.findUnique({
    where: {
      public_id,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return sendTRPCResponse({
      status: 404,
      message: "Gausah aneh aneh deh",
    });
  }

  const createdReport = await prisma.report.create({
    data: {
      post_id: post.id,
      reason,
    },
  });

  if (!createdReport) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal nge-laporin postingan ini",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Thank You bre udah nge laporin, Ntar di cek",
  });
};

export const safePost = async (prisma: PrismaContext, post_id: string) => {
  const deletedReport = await prisma.report.deleteMany({
    where: {
      post_id,
    },
  });

  if (!deletedReport) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal meloloskan postingan aman ini",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Ok aman yah bre harus nya",
  });
};

export const takeDown = async (prisma: PrismaContext, post_id: string) => {
  return prisma.$transaction(async (tx) => {
    const deletedPost = await tx.post.delete({
      where: {
        id: post_id,
      },
    });

    if (!deletedPost) {
      return sendTRPCResponse({
        status: 400,
        message: "Gagal take-down postingan",
      });
    }

    await tx.tag_post.deleteMany({
      where: {
        post_id: post_id,
      },
    });

    return sendTRPCResponse({
      status: 201,
      message: "Postingan ini berhasil di take-down",
    });
  });
};
