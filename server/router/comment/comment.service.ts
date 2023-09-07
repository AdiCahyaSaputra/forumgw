import { sendTRPCResponse } from "@/lib/helper/api.helper";
import { PrismaContext } from "@/server/trpc";

type TUpSertComment = {
  postId: string;
  userId: string;
  text: string;
};
export const createComment = async (
  prisma: PrismaContext,
  input: TUpSertComment,
) => {
  const createdComment = await prisma.comment.create({
    data: input,
  });

  if (!createdComment) {
    return sendTRPCResponse({
      status: 400,
      message: "Gagal mengomentari postingan ini",
    });
  }

  return sendTRPCResponse(
    {
      status: 201,
      message: "Berhasil mengomentari postingan ini",
    },
    createdComment,
  );
};
