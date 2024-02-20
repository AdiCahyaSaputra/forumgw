"use client";

import React from "react";
import { Provider } from "react-wrap-balancer";

type Props = {
  children: React.ReactNode;
};

const BalancerProvider = (props: Props) => {
  return <Provider>{props.children}</Provider>;
};

export default BalancerProvider;
