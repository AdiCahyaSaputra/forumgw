import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import LoadingState from "../state/LoadingState";

type TProps = {
  backUrl: string;
  title: string;
  data?: string | null;
};

const SubMenuHeader: React.FC<TProps> = ({ backUrl, title, data }) => {
  return (
    <div className="flex container z-10 border-b bg-white supports-backdrop-filter:bg-white/60 supports-backdrop-filter:backdrop-blur-md items-center sticky top-0 py-4 justify-between lg:justify-start gap-4">
      <Link href={backUrl}>
        <Button variant="outline" size="icon">
          <ChevronLeft className="w-4 aspect-square" />
        </Button>
      </Link>
      <div className="flex items-center justify-between gap-2 w-full">
        <h1 className="text-lg font-bold">{title}</h1>
        {data && (
          <LoadingState
            data={data}
            loadingFallback={
              <Skeleton className="p-2 rounded-md text-muted">Loading</Skeleton>
            }
          >
            <code className="p-2 bg-secondary rounded-md">{data}</code>
          </LoadingState>
        )}
      </div>
    </div>
  );
};

export default SubMenuHeader;
