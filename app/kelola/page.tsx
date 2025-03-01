"use client";

import CardPost from "@/components/reusable/kelola/CardPost";
import FilterPostDropdown from "@/components/reusable/kelola/FilterPostDropdown";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

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
  tag_post: {
    tag: Tag;
  }[];
  _count: {
    comments: number;
  };
};

const KelolaPostingan: React.FC = () => {
  const [filter, setFilter] = useState<"Public" | "Anonymous" | "Semua">(
    "Semua"
  );

  const { data: postResponse, refetch } = trpc.post.getUserPosts.useQuery({
    withAnonymousPosts: true,
  });

  const getFilteredPost = (post: TPost) => {
    const filteredPostCond = {
      Semua: post,
      Public: post.anonymous === null,
      Anonymous: post.user === null,
    };

    return filteredPostCond[filter];
  };

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Semua Postingan</h2>
      <p className="text-foreground/60">Kelola semua postingan disini bre</p>

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
                  <CardPost
                    {...post}
                    onPostChanges={() => refetch()}
                    key={idx}
                  />
                ))}
            </div>
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default KelolaPostingan;
