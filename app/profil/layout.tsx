import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { PropsWithChildren } from "react";

const ProfilLayout = async (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">
          <SubMenuHeader data={null} title="Profil" backUrl="/forum?c=fyp" />
          {props.children}
        </main>
      </div>
    </>
  );
};

export default ProfilLayout;
