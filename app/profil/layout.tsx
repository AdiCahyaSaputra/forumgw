import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { getAuthUser } from "@/lib/helper/auth.helper";
import { cookies } from "next/headers";
import React from "react";
import { PropsWithChildren } from "react";

const ProfilLayout = async (props: PropsWithChildren) => {
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
            data={user?.username}
            title="Profil"
            backUrl="/forum?c=fyp"
          />
          {props.children}
        </main>
      </div>
    </>
  );
};

export default ProfilLayout;
