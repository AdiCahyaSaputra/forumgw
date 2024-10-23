"use client";

import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const DetailReport = ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = use(params);

  const { data: postResponse } = trpc.post.getPostReportedReasons.useQuery({
    post_id: postId,
  });

  const router = useRouter();
  const { toast } = useToast();
  const [response, setResponse] = useState({
    message: "",
  });

  const { mutate: safePost, isLoading: safePostLoading } =
    trpc.post.safePost.useMutation();
  const { mutate: takeDown, isLoading: takeDownLoading } =
    trpc.post.takeDown.useMutation();

  const safePostHandler = () => {
    safePost(
      {
        post_id: postId,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          router.push("/reported-post");
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });
          console.log(error);
        },
      }
    );
  };

  const takeDownHandler = () => {
    takeDown(
      {
        post_id: postId,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          router.push("/reported-post");
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });
          console.log(error);
        },
      }
    );
  };

  useEffect(() => {
    if (!!response.message) {
      toast({
        title: "Notifikasi",
        description: response.message,
      });

      setResponse({
        message: "",
      });
    }
  }, [response]);

  return (
    <>
      <h2 className="text-destructive py-2 px-4 bg-destructive/20 w-max rounded-md font-bold mt-4">
        Kenapa Post Ini Di Report?
      </h2>
      <div className="mt-2 pb-10">
        <EmptyState
          status={postResponse?.status}
          message={postResponse?.message}
        >
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<Skeleton className="w-full h-10 rounded-md" />}
          >
            <ul className="space-y-2 list-disc pl-4">
              {postResponse?.data?.map((report, idx) => (
                <li className="text-foreground break-all" key={idx}>
                  {report.reason}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button
                variant="destructive"
                disabled={takeDownLoading}
                onClick={takeDownHandler}
              >
                {takeDownLoading ? "Proses..." : "Take Down"}
              </Button>
              <Button
                variant="outline"
                disabled={safePostLoading}
                onClick={safePostHandler}
              >
                {safePostLoading ? "Prosess..." : "Safe Post"}
              </Button>
            </div>
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default DetailReport;
