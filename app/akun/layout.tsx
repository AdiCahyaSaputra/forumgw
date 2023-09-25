import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Pengaturan Akun",
};

const AkunLayout: React.FC = async (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">
          <SubMenuHeader backUrl="/forum?c=fyp" title="Pengaturan Akun" />
          <div className="container">{props.children}</div>
        </main>
      </div>
    </>
  );
};

export default AkunLayout;
