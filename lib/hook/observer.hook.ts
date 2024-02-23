import { useEffect, useRef, useState } from "react";

export const useObserver = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 1.0,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    isIntersecting,
    ref,
  };
};
