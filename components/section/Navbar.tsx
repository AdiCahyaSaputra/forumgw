"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hook/auth.hook";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import LoadingState from "../reusable/state/LoadingState";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<{ username: string; image: null | string }>({
    username: "",
    image: null,
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    // Updated User data
    setUser({
      username: currentUser?.username || "",
      image: currentUser?.image || null,
    });
  }, [currentUser]);

  return (
    <Suspense>
      <nav className="py-4 border-b">
        <div className="lg:px-[2rem] px-4 flex justify-between items-center">
          <Link href="/forum?c=fyp" className="font-bold text-xl">
            Forum<span className="text-red-600">Gw</span>
          </Link>

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
    </Suspense>
  );
};

export default Navbar;
