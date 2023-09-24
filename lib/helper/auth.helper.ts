import { jwtVerify } from "jose";

export type TAuthUser = {
  id: string;
  role: {
    name: string;
  };
};

export const getAuthUser = async (token: string | null) => {
  if (!token) return null;

  const payload = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET),
  )
    .then((decoded) => decoded.payload as TAuthUser)
    .catch(() => null);

  return payload;
};
