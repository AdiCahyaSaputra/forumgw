import React from "react";

type TProps = {
  data?: any;
  children: React.ReactNode;
  loadingFallback: React.ReactElement;
};

const LoadingState: React.FC<TProps> = ({
  data,
  children,
  loadingFallback,
}) => {
  return <>{data ? children : loadingFallback}</>;
};

export default LoadingState;
