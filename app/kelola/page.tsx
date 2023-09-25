"use client";

import CardPost from "@/components/reusable/kelola/CardPost";
import FilterPostDropdown from "@/components/reusable/kelola/FilterPostDropdown";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

type TPost = {
  id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    username: string;
    image: string | null;
    id: string;
  } | null;
  anonymous?: {
    username: string;
    id: string;
  } | null;
  _count: {
    comments: number;
  };
};

const KelolaPostingan: React.FC = () => {
  const [filter, setFilter] = useState<"Public" | "Anonymous" | "Semua">(
    "Semua",
  );

  const { data: postResponse, refetch } = trpc.post.getUserPosts.useQuery({
    withAnonymousPosts: true,
  });

  const [response, setResponse] = useState({
    message: "",
  });

  const { toast } = useToast();

  const getFilteredPost = (post: TPost) => {
    const filteredPostCond = {
      Semua: post,
      Public: post.anonymous === null,
      Anonymous: post.user === null,
    };

    return filteredPostCond[filter];
  };

  useEffect(() => {
    if (!!response.message) {
      refetch();

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
      <h2 className="text-lg font-bold mt-4">Semua Postingan Lu</h2>
      <p className="text-foreground/60">Kelola semua postingan lu disini bre</p>

      <div className="mt-8 pb-10">
        <FilterPostDropdown filter={filter} setFilter={setFilter} />
        <div className="my-4" />

        <EmptyState
          status={postResponse?.status}
          message={postResponse?.message}
        >
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
          >
            <div className="space-y-2">
              {postResponse?.data
                ?.filter((post) => getFilteredPost(post))
                .map((post, idx) => (
                  <CardPost {...post} key={idx} setResponse={setResponse} />
                ))}
            </div>
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default KelolaPostingan;
