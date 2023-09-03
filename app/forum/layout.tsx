import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { getAuthUser } from "@/lib/helper/auth.helper";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

const ForumLayout: React.FC = async (props: PropsWithChildren) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const user = await getAuthUser(token?.value || null);

  return (
    <>
      <Navbar userImage={user?.image} username={user?.username} />
      <div className="flex relative items-start">
        <AsideSection username={user?.username} image={user?.image} />
        <main className="h-max pb-10 grow">{props.children}</main>
      </div>
    </>
  );
};

export default ForumLayout;
