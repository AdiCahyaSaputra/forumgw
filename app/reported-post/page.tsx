"use client";

import CardPostReport from "@/components/reusable/reported-post/CardPostReport";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import React, { useEffect } from "react";

const ReportedPost: React.FC = () => {
  const { data: postResponse, refetch } = trpc.post.getReportedPost.useQuery();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <h2 className="text-lg font-bold mt-4">
        Semua Postingan Yang Dilaporin Netizen
      </h2>
      <p className="text-foreground/60">
        Kamu bisa take down postingan bermasalah disini
      </p>

      <div className="mt-4 space-y-2 pb-10">
        <EmptyState
          status={postResponse?.status}
          message={postResponse?.message}
        >
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
          >
            {postResponse?.data?.map((post, idx) => (
              <CardPostReport {...post} key={idx} />
            ))}
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default ReportedPost;
