import React from "react";

type TProps = {
  status: number;
  message: string;
  children: React.ReactNode;
};

const EmptyState: React.FC<TProps> = ({ status, message, children }) => {
  return (
    <>
      {status !== 404 ? (
        children
      ) : (
        <p className="py-2 px-4 bg-secondary rounded-md w-max">{message}</p>
      )}
    </>
  );
};

export default EmptyState;
