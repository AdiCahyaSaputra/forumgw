import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Kelola Postingan",
  description: "Kelola Postingan disini bre",
};

const KelolaLayout: React.FC = async (props: React.PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">
          <SubMenuHeader backUrl="/forum?c=fyp" title="Kelola Postingan" />
          <div className="container">{props.children}</div>
        </main>
      </div>
    </>
  );
};

export default KelolaLayout;
