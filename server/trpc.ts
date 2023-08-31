import { getAuthUser } from "@/lib/helper/auth.helper";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./../prisma/db";

export const createContext = async (opts: CreateNextContextOptions) => {
  const cookie = opts.req.cookies;
  const token = cookie.token || null;

  return {
    token,
    prisma,
  };
};

export type PrismaContext = typeof prisma;
export type Context = inferAsyncReturnType<typeof createContext>;

const trpc = initTRPC.context<Context>().create();

const isAuthenticated = trpc.middleware(async (opts) => {
  const user = await getAuthUser(opts.ctx.token);

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});

const isDeveloper = trpc.middleware(async (opts) => {
  const user = await getAuthUser(opts.ctx.token);

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (user.Role.name !== "developer")
    throw new TRPCError({ code: "FORBIDDEN" });

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});

export const router = trpc.router;
export const procedure = trpc.procedure;
export const authProcedure = procedure.use(isAuthenticated);
export const devProcedure = procedure.use(isDeveloper);
