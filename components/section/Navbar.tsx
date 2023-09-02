"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import LoadingState from "../reusable/state/LoadingState";

type TProps = {
  userImage?: string | null;
  username?: string;
  id?: string;
};

const Navbar: React.FC<TProps> = ({ userImage, username, id }) => {
  const [user, setUser] = useState({
    username,
    image: userImage,
  });

  const { data: userResponse } = trpc.user.getProfile.useQuery({
    userId: id as string,
    username: "",
  });

  useEffect(() => {
    setUser({
      username: userResponse?.data?.username,
      image: userResponse?.data?.image,
    });
  }, [userResponse]);

  return (
    <nav className="py-4 border-b">
      <div className="container flex justify-between items-center">
        <h1 className="font-bold text-xl">
          Forum<span className="text-red-600">Gw</span>
        </h1>

        <Avatar>
          <AvatarImage src={user.image ?? ""} />
          <LoadingState
            data={user.username}
            loadingFallback={
              <AvatarFallback className="animate-pulse"></AvatarFallback>
            }
          >
            {user.username && (
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            )}
          </LoadingState>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
