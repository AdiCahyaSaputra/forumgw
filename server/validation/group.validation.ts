import { z } from "zod";

export const createGroupRequest = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  invitedUsername: z.array(z.string()).nullable(),
});

export const acceptOrDeclineInviteRequest = z.object({
  type: z.enum(["accept", "decline"]),
  invite_id: z.number(),
  group_id: z.string(),
});

export const getGroupByQueryRequest = z.object({
  searchTerm: z.string().min(1).nullable(),
});

export const getGroupByPublicIdRequest = z.object({
  public_id: z.string(),
});

export const createGroupPostRequest = z.object({
  content: z.string(),
  group_public_id: z.string(),
  isAnonymousPost: z.boolean().default(false),
});

export const getDetailedGroupPostRequest = z.object({
  public_group_id: z.string(),
  public_post_id: z.string(),
});

export const getGroupPostByAuthorRequest = z.object({
  group_public_id: z.string(),
  withAnonymousPosts: z.boolean().default(false),
  withComments: z.boolean().default(false),
});

export const editGroupRequest = z.object({
  group_public_id: z.string(),
  update_data: z.object({
    name: z.string(),
    description: z.string(),
    invitedUsername: z.array(z.string()).nullable(),
    logo: z.string().nullable(),
  }),
});

export const deleteGroupRequest = z.object({
  group_public_id: z.string(),
});

export const getDetailedGroupMemberByPublicIdRequest = z.object({
  public_id: z.string(),
});

export const askToJoinGroupRequest = z.object({
  public_id: z.string(),
});

export const getGroupJoinRequestValidation = z.object({
  public_id: z.string(),
});

export const acceptOrDeclineJoinRequestValidation = z.object({
  type: z.enum(["accept", "decline"]),
  request_id: z.number(),
  group_id: z.string(),
});

export const exitFromGroupRequest = z.object({
  public_id: z.string(),
});
