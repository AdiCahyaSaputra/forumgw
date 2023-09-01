"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

type TProps = {
  children: React.ReactNode;
};

const ProgressProvider: React.FC<TProps> = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#dc2626"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressProvider;
