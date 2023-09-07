import { TAuthUser } from "../helper/auth.helper";
import { trpc } from "../trpc";

export const useAuth = () => {
  const { data: userResponse } = trpc.user.getAuthUser.useQuery();

  return {
    currentUser: userResponse?.data as TAuthUser,
  };
};
