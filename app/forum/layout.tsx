import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { getAuthUser } from "@/lib/helper/auth.helper";
import { cookies } from "next/headers";
import React from "react";

type TProps = {
  children: React.ReactNode;
};

const ForumLayout: React.FC<TProps> = async ({ children }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const user = await getAuthUser(token?.value || null);

  return (
    <>
      <Navbar userImage={user?.image} username={user?.username} />
      <div className="flex relative items-start">
        <AsideSection username={user?.username} />
        <main className="h-[2000px] grow">{children}</main>
      </div>
    </>
  );
};

export default ForumLayout;
