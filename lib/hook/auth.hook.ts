import { TAuthUser } from "../helper/auth.helper";
import { trpc } from "../trpc";

export type TCurrentAuthUser = {
  role: {
    name: string;
  } | null;
  id: string;
  username: string;
  name: string;
  image: string | null;
  bio: string | null;
};

export const useAuth = () => {
  const { data: userResponse } = trpc.user.getAuthUser.useQuery();

  return {
    currentUser: userResponse?.data as TCurrentAuthUser,
  };
};
