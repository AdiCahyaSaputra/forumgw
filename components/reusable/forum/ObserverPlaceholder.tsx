import { Skeleton } from "@/components/ui/skeleton";
import { useObserver } from "@/lib/hook/observer.hook";
import React, { useEffect } from "react";

type TProps = {
  callback: () => void;
};

const ObserverPlaceholder = ({ callback }: TProps) => {
  const { isIntersecting, ref } = useObserver();

  useEffect(() => {
    console.log(isIntersecting);

    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting]);

  return (
    <div className="w-full" ref={ref}>
      <Skeleton className="w-full h-24 rounded-md" />
    </div>
  );
};

export default ObserverPlaceholder;
