import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { getAuthUser } from "@/lib/helper/auth.helper";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: "Kelola Postingan",
  description: "Kelola Postingan lu disini bre",
};

const KelolaLayout: React.FC = async (props: React.PropsWithChildren) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const user = await getAuthUser(token?.value || null);

  return (
    <>
      <Navbar userImage={user?.image} username={user?.username} />
      <div className="flex relative items-start">
        <AsideSection username={user?.username} image={user?.image} />
        <main className="h-max pb-10 grow">
          <SubMenuHeader
            backUrl="/forum?c=fyp"
            data={user?.username}
            title="Kelola Postingan"
          />
          <div className="container">{props.children}</div>
        </main>
      </div>
    </>
  );
};

export default KelolaLayout;
