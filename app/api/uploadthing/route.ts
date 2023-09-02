import { ourFileRouter } from "@/lib/helper/uploadthing.helper";
import { createNextRouteHandler } from "uploadthing/next";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
