import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthUser } from "./auth.helper";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const token = req.cookies.get("token")?.value;
      const payload = await getAuthUser(token ?? "");

      if (!payload) throw new Error("Unauthorized");

      return { userId: payload?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
