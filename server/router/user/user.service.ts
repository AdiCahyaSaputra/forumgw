import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { excludeField } from "@/lib/helper/obj.helper";
import { filterBadWord } from "@/lib/helper/sensor.helper";
import type { PrismaContext } from "@/server/trpc";
import { compareSync, hashSync } from "bcrypt-ts";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";

type TSignUpUser = {
  name: string;
  username: string;
  password: string;
};

type TSignInUser = Omit<TSignUpUser, "name">;

type TUserUnique = {
  username: string | null;
};

type TUpdateUser = {
  name: string;
  username: string;
  bio: string | null;
  image: string | null;
};

export const signUp = async (prisma: PrismaContext, input: TSignUpUser) => {
  const username = input.username.split(" ").join("");
  const { name, password } = input;

  if (
    filterBadWord(username).includes("***") ||
    filterBadWord(name).includes("***")
  ) {
    return sendTRPCResponse({
      status: 400,
      message: 'Gosah aneh" deh bre, Matiin burpsuite nya',
    });
  }

  const userExist = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExist) {
    return sendTRPCResponse({
      status: 400,
      message: "User udah terdaftar bre!",
    });
  }

  const createdUser = await prisma.user.create({
    data: {
      username,
      name,
      password: hashSync(password, 10),
      role_id: username === "adicss" ? 2 : 1, // Role = common | developer
    },
  });

  if (!createdUser) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal nge-daftarin akun nya bre :(",
    });
  }

  return sendTRPCResponse(
    {
      status: 201,
      message: "Ok akun nya berhasil terdaftar",
    },
    createdUser,
  );
};

export const signIn = async (prisma: PrismaContext, input: TSignInUser) => {
  const { username, password } = input;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      password: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) {
    return sendTRPCResponse({
      status: 400,
      message: "Akun ini belom terdaftar bre!",
    });
  }

  const isPasswordCorrect = compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return sendTRPCResponse({
      status: 401,
      message: "Username dan Password gk match bre",
    });
  }

  const jwt = await prisma.jwt.create({
    data: {
      user_id: user.id,
      expired_in: new Date(Date.now() + 2 * (60 * 60 * 1000)), // 2hr
    },
  });

  if (!jwt) {
    return sendTRPCResponse({
      status: 400,
      message: "SignIn Error",
    });
  }

  const token = await new SignJWT({
    id: jwt.id,
    expired_in: jwt.expired_in,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const refreshToken = await new SignJWT({
    id: jwt.id,
    expired_in: new Date(Date.now() + 24 * (60 * 60 * 1000)), // 1 Day
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ok, Selamat berdiskusi..",
    },
    {
      token,
      refreshToken
    },
  );
};

export const getProfile = async (
  prisma: PrismaContext,
  user_id: string,
  input: TUserUnique,
) => {
  const whereClause = input.username
    ? { username: input.username }
    : { id: user_id };

  const existingUser = await prisma.user.findUnique({
    where: whereClause,
    select: {
      id: true, // TODO: hehe
      name: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  if (!existingUser) {
    return sendTRPCResponse({
      status: 404,
      message: "User yang dicari tidak ketemu!",
    });
  }

  const existingUserPosts = await prisma.post.findMany({
    where: {
      AND: [
        {
          user_id: existingUser?.id,
          category_id: {
            not: 3,
          },
        },
      ],
    },
    select: {
      public_id: true,
      content: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return sendTRPCResponse(
    {
      status: 200,
      message: "Nih user yang dicari",
    },
    {
      user: excludeField(existingUser, ["id"]),
      posts: existingUserPosts,
    },
  );
};

export const editProfile = async (
  prisma: PrismaContext,
  user_id: string,
  input: TUpdateUser,
) => {
  if (
    filterBadWord(input.username).includes("***") ||
    filterBadWord(input.name).includes("***")
  ) {
    return sendTRPCResponse({
      status: 400,
      message: 'Gosah aneh" deh bre, Matiin burpsuite nya',
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user_id,
    },
    data: input,
  });

  if (!updatedUser) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal mengubah data user",
    });
  }

  return sendTRPCResponse({
    status: 201,
    message: "Berhasil mengubah data user",
  });
};

export const searchUser = async (prisma: PrismaContext, username: string) => {
  const user = await prisma.user.findMany({
    where: {
      username: {
        contains: username,
      },
    },
    select: {
      username: true,
      name: true,
      image: true,
    },
  });

  if (!user.length) {
    return sendTRPCResponse({
      status: 404,
      message: "User yang di cari ga ada",
    });
  }

  return sendTRPCResponse(
    {
      status: 200,
      message: "Ada nih user nya",
    },
    user,
  );
};
