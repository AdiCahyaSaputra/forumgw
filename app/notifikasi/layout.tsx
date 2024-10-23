import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Notifikasi",
  description: "Sesuatu yang mungkin lkamu tungguin terus",
};

const NotifikasiLayout: React.FC = async (props: React.PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">
          <SubMenuHeader backUrl="/forum?c=fyp" title="Notifikasi" />
          <div className="container">{props.children}</div>
        </main>
      </div>
    </>
  );
};

export default NotifikasiLayout;
