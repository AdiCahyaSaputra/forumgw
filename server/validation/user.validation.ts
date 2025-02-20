import { z } from "zod";

export const mentioningUserRequest = z.object({
  username: z.string().nullable(),
});
