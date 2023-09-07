"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import LoadingState from "../reusable/state/LoadingState";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TProps = {
  userImage?: string | null;
  username?: string;
};

const Navbar: React.FC<TProps> = ({ userImage, username }) => {
  const [user, setUser] = useState({
    username,
    image: userImage,
  });

  const { data: userResponse } = trpc.user.getProfile.useQuery({
    username: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Updated User data
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

        <Link href={`/profil/${user.username}`}>
          <Avatar className="cursor-pointer rounded-md">
            <AvatarImage src={user.image ?? ""} />
            <LoadingState
              data={user.username}
              loadingFallback={
                <AvatarFallback className="animate-pulse rounded-md"></AvatarFallback>
              }
            >
              {user.username && (
                <AvatarFallback className="rounded-md">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              )}
            </LoadingState>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
