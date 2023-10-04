import { jwtVerify } from "jose";

export type TJWTPayload = {
  id: string;
  expired_in: string;
};

export const getJWTPayload = async (token: string | null) => {
  if (!token) return null;

  const payload = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET),
  )
    .then((decoded) => decoded.payload as TJWTPayload)
    .catch(() => null);

  return payload;
};
