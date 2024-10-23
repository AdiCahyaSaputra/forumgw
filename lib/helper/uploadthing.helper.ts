import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getJWTPayload } from "./auth.helper";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const token = req.cookies.get("token")?.value || null;
      const refreshToken = req.cookies.get("refresh_token")?.value || null;

      const jwtPayload = await getJWTPayload(token, refreshToken);

      if (!jwtPayload) throw new Error("Unauthorized");

      return { jwt: jwtPayload?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for :", metadata.jwt);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
