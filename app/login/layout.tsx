import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login 😋",
};

type TProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<TProps> = ({ children }) => {
  return (
    <main className="flex items-center h-screen justify-center">
      {children}
    </main>
  );
};

export default LoginLayout;
