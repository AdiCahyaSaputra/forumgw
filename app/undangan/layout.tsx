import AsideSection from "@/components/section/AsideSection";
import Navbar from "@/components/section/Navbar";
import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Undangan",
  description: "Gabung ke sirkel orang lewat jalur undangan",
};

const UndanganLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex relative items-start">
        <AsideSection />
        <main className="h-max pb-10 grow">
          <div className="container">{props.children}</div>
        </main>
      </div>
    </>
  );
};

export default UndanganLayout;
