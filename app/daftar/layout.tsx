import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Daftar 🤏🏼",
};

type TProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<TProps> = ({ children }) => {
  return (
    <main className="flex items-center h-[100vh] justify-center">
      {children}
    </main>
  );
};

export default LoginLayout;
