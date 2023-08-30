import { appRouter } from "@/server/router/_app";
import { createContext } from "@/server/trpc";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: appRouter,
  createContext(opts) {
    return createContext({
      ...opts,
    });
  },
});
