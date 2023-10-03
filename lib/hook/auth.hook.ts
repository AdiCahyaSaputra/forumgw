import { destroyAccessToken } from "../helper/api.helper";
import { trpc } from "../trpc";
import { useRouter } from "next/navigation";

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
  const { data: userResponse, isError } = trpc.user.getAuthUser.useQuery();
  const router = useRouter();

  if (isError) {
    destroyAccessToken().then((res) => res.isSuccess && router.push("/login"));
  }

  return {
    currentUser: userResponse?.data as TCurrentAuthUser,
  };
};
