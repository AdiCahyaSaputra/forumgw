import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import React, { PropsWithChildren } from "react";

const ForumLayout: React.FC = async (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">{props.children}</main>
      </div>
    </>
  );
};

export default ForumLayout;
