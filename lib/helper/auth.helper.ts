import { prisma } from "@/prisma/db";
import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import { setAccessToken } from "./api.helper";

export type TJWTPayload = {
  id: string;
  expired_in: string;
};

export const getJWTPayload = async (token: string | null, refreshToken: string | null) => {
  if (!token) {
    if(!refreshToken) return null;

    return await refreshJWT(refreshToken);
  }

  return await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )
    .then((decoded) => decoded.payload as TJWTPayload)
    .catch(() => null);
};

export const refreshJWT = async (refreshToken: string | null) => {
  if (!refreshToken) return null;

  const resfreshTokenPayload = await jwtVerify(
    refreshToken,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )
    .then((decoded) => decoded.payload as TJWTPayload)
    .catch(() => null);

  const refreshTokenData = await prisma.jwt.findUnique({
    where: {
      id: resfreshTokenPayload?.id,
    },
    select: {
      user_id: true,
    },
  });

  if (!refreshTokenData) return null;

  const createdJwt = await prisma.jwt.create({
    data: {
      user_id: refreshTokenData.user_id,
      expired_in: new Date(Date.now() + 2 * (60 * 60 * 1000)), // 2hr
    },
  });

  if (!createdJwt) return null;

  const newToken = await new SignJWT({
    id: createdJwt.id,
    expired_in: createdJwt.expired_in,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // QUESTIIONS: logout the user automatically when refresh token is expired or not ?
  const newRefreshToken = await new SignJWT({
    id: createdJwt.id,
    expired_in: new Date(Date.now() + 24 * (60 * 60 * 1000)), // 1 Day
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  await setAccessToken({
    token: newToken,
    refreshToken: newRefreshToken,
  });

  return createdJwt;
};
