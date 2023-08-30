import { User } from "@prisma/client";
import { jwtVerify } from "jose";

export const getAuthUser = async (token: string | null) => {
  if (!token) return null;

  const payload = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )
    .then((decoded) => decoded.payload as Omit<User, "password">)
    .catch(() => null);

  return payload;
};
