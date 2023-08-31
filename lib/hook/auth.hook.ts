import { TAuthUser } from "../helper/auth.helper";
import { trpc } from "../trpc";

export const useAuth = () => {
  const { data: userResponse, isError } = trpc.user.getAuthUser.useQuery();

  return {
    currentUser: userResponse?.data as TAuthUser,
  };
};
