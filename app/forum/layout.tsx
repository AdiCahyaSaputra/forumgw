import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import React from "react";

type TProps = {
  children: React.ReactNode;
};

const ForumLayout: React.FC<TProps> = ({ children }) => {
  return (
    <>
      <Navbar userImage={null} username="adicss" />
      <div className="flex relative items-start">
        <AsideSection username="adicss" />
        <main className="h-[2000px] grow">{children}</main>
      </div>
    </>
  );
};

export default ForumLayout;
