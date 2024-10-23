import { getJWTPayload } from "@/lib/helper/auth.helper";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./../prisma/db";

export const createContext = async (opts: CreateNextContextOptions) => {
  const cookie = opts.req.cookies;

  const token = cookie.token || null;
  const refreshToken = cookie.refresh_token || null;

  return {
    token,
    refreshToken,
    prisma,
  };
};

export type PrismaContext = typeof prisma;
export type Context = inferAsyncReturnType<typeof createContext>;

const trpc = initTRPC.context<Context>().create();

const isAuthenticated = trpc.middleware(async (opts) => {
  const jwtPayload = await getJWTPayload(opts.ctx.token, opts.ctx.refreshToken);

  const data = await prisma.jwt.findUnique({
    where: {
      id: jwtPayload?.id,
    },
    select: {
      user: {
        select: {
          id: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!data?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: data?.user,
    },
  });
});

const isDeveloper = trpc.middleware(async (opts) => {
  const jwtPayload = await getJWTPayload(opts.ctx.token, opts.ctx.refreshToken);

  const data = await prisma.jwt.findUnique({
    where: {
      id: jwtPayload?.id,
    },
    select: {
      user: {
        select: {
          id: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!data?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  if (data?.user.role?.name !== "developer")
    throw new TRPCError({ code: "FORBIDDEN" });

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: data?.user,
    },
  });
});

export const router = trpc.router;
export const procedure = trpc.procedure;
export const authProcedure = procedure.use(isAuthenticated);
export const devProcedure = procedure.use(isDeveloper);
