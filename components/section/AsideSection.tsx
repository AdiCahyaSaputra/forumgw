"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { destroyAccessToken } from "@/lib/helper/api.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import { trpc } from "@/lib/trpc";
import {
  BellRing,
  Bug,
  CircleDashed,
  GanttChartSquare,
  Loader2,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import NavItem from "../reusable/layout/NavItem";
import LoadingState from "../reusable/state/LoadingState";
import { Button } from "../ui/button";
// import { useWebSocket } from "@/lib/hook/websocket.hook";

const navCategoryItems = [
  {
    url: "/forum?c=fyp",
    label: "FYP",
    Icon: TrendingUp,
  },
  {
    url: "/forum?c=dev",
    label: "Dari Developer",
    Icon: Bug,
  },
  {
    url: "/sirkel",
    label: "Sirkel Khusus",
    Icon: Users,
  },
];

const navSettingItems = [
  {
    url: "/akun",
    label: "Akun",
    Icon: User,
  },
];

const navDashboardItems = [
  {
    url: "/kelola",
    label: "Kelola Post",
    Icon: GanttChartSquare,
  },

  {
    url: "/kelola-sirkel",
    label: "Kelola Sirkel",
    Icon: CircleDashed,
  },
];

const AsideSection: React.FC = () => {
  const pathname = usePathname();
  const query = useSearchParams();

  const [openAside, setOpenAside] = useState(false);
  const [logoutClicked, setLogoutClicked] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    image: null | string;
    role: "common" | "developer" | string;
  }>({
    username: "",
    image: null,
    role: "common",
  });

  const { currentUser } = useAuth();

  const { data: notificationResponse } =
    trpc.notification.getNotification.useQuery();

  const { data: groupResponse } = trpc.group.getGroupInvitation.useQuery();

  const logoutHandler = async () => {
    setLogoutClicked(true);
    const { isSuccess } = await destroyAccessToken();

    if (isSuccess) router.push("/login");
  };

  useEffect(() => {
    // Updated User data
    setUser({
      username: currentUser?.username || "",
      image: currentUser?.image || null,
      role: currentUser?.role?.name || "common",
    });
  }, [currentUser]);

  useEffect(() => {
    // When current url has change
    setOpenAside(false);
  }, [pathname, query]);

  return (
    <>
      <aside
        className={`
        lg:pl-[2rem] lg:border-r lg:pr-4 py-4 flex flex-col justify-between lg:w-1/5 lg:h-[100vh] h-[100dvh] lg:sticky lg:top-0 lg:px-0
        lg:z-10
        px-4 bg-secondary lg:bg-transparent lg:translate-y-0 transition-transform
        fixed inset-0 ${openAside ? "translate-y-0" : "-translate-y-[200%]"}
        z-30
    `}
      >
        <div>
          <h2 className="text-lg font-bold text-foreground/70">
            Kategori Diskusi
          </h2>
          <ul className="space-y-2 mt-2">
            {navCategoryItems.map((item, idx) => (
              <NavItem {...item} key={idx} />
            ))}
          </ul>

          <h2 className="text-lg font-bold mt-4 text-foreground/70">
            Dashboard
          </h2>
          <ul className="space-y-2 mt-2">
            {navDashboardItems.map((item, idx) => (
              <NavItem {...item} key={idx} />
            ))}

            {user.role === "developer" && (
              <NavItem
                url="/reported-post"
                label="Reported Post"
                Icon={Megaphone}
              />
            )}
          </ul>

          <h2 className="text-lg font-bold mt-4 text-foreground/70">
            Pengaturan
          </h2>
          <ul className="space-y-2 mt-2">
            {navSettingItems.map((item, idx) => (
              <NavItem {...item} key={idx} />
            ))}
            <NavItem
              url="/notifikasi"
              label={`${
                notificationResponse?.data.filter((notif) => !notif.is_read)
                  .length || ""
              } Notifikasi`}
              Icon={BellRing}
            />

            <NavItem
              url="/undangan"
              label={`${groupResponse?.data?.length || ""} Undangan`}
              Icon={Mail}
            />
          </ul>
        </div>

        <div>
          <div className="flex items-start gap-2">
            <Avatar className="rounded-md">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="rounded-md">
                {user.username && user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-start grow justify-between">
              <div>
                <LoadingState
                  data={user.username}
                  loadingFallback={
                    <h3 className="text-sm leading-none font-bold p-1 rounded-md animate-pulse bg-muted text-muted">
                      user
                    </h3>
                  }
                >
                  <h3 className="text-sm leading-none font-bold">
                    {user.username}
                  </h3>
                </LoadingState>
                <Link
                  href={`/profil/${user.username}`}
                  className="text-xs hover:underline"
                >
                  Lihat Profil
                </Link>
              </div>
              <Button
                onClick={logoutHandler}
                variant="destructive"
                className="w-max"
                disabled={logoutClicked}
              >
                {logoutClicked ? (
                  <Loader2 className="w-4 aspect-square animate-spin" />
                ) : (
                  <LogOut className="w-4 aspect-square" />
                )}
              </Button>
            </div>
          </div>

          <Button
            className="w-full flex items-center space-x-2 justify-start mt-2 bg-white lg:hidden"
            variant="outline"
            onClick={() => setOpenAside(false)}
          >
            <Menu className="w-4 aspect-square" />
            <span>Tutup Menu</span>
          </Button>
        </div>
      </aside>
      <div className="fixed lg:hidden bottom-0 p-4 inset-x-0 z-20 bg-white supports-backdrop-filter:bg-white/60 border-t supports-backdrop-filter:backdrop-blur-md">
        <Button
          onClick={() => setOpenAside(true)}
          className="w-full flex items-center justify-start space-x-2"
        >
          <Menu className="w-4 aspect-square" />
          <span>Buka Menu</span>
        </Button>
      </div>
    </>
  );
};

export default AsideSection;
