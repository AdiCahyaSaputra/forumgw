import React from "react";
import { twMerge } from "tailwind-merge";

type TProps = {
  status?: number;
  message?: string;
  children: React.ReactNode;
  className?: string;
};

const EmptyState: React.FC<TProps> = ({
  status,
  message,
  children,
  className,
}) => {
  return (
    <>
      {status !== 404 ? (
        children
      ) : (
        <p
          className={twMerge(
            `py-2 px-4 bg-secondary rounded-md w-max`,
            className
          )}
        >
          {message}
        </p>
      )}
    </>
  );
};

export default EmptyState;
