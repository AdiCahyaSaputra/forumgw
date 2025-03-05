import { z } from "zod";

export const mentioningUserRequest = z.object({
  username: z.string().nullable(),
  groupPublicId: z.string().nullable().default(null),
});

export const signUpRequest = z.object({
  username: z.string().min(3).trim().toLowerCase(),
  name: z.string(),
  password: z.string(),
});

export const signInRequest = z.object({
  username: z.string().min(3).trim().toLowerCase(),
  password: z.string(),
});

export const getProfileRequest = z.object({
  username: z.string().nullable(),
});

export const editProfileRequest = z.object({
  name: z.string(),
  username: z.string().min(3).trim().toLowerCase(),
  bio: z.string().max(100).nullable(),
  image: z.string().nullable(),
});

export const searchUserRequest = z.object({
  username: z.string().min(1),
});
