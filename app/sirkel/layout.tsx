import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Sirkel Khusus",
  description: "komunitas yang memiliki frekuensi dan hobi yang sama",
};

const SirkelLayout = (props: PropsWithChildren) => {
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

export default SirkelLayout;
