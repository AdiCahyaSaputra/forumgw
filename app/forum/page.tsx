"use client";

import CreatePost from "@/components/reusable/forum/CreatePost";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type TProps = {};

const Forum: React.FC<TProps> = ({}) => {
  const query = useSearchParams();
  const category = query?.get("c");

  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  const { data: postResponse, refetch } = trpc.post.getFeedByCategory.useQuery({
    categoryId: category === "fyp" ? "1" : category === "dev" ? "2" : "1",
  });

  useEffect(() => {
    console.log(query?.get("c"));
    if (createdPost) {
      refetch();
      setCreatedPost(false);
    }
  }, [createdPost, postResponse]);

  return (
    <>
      <CreatePost
        openCreateMenu={openCreateMenu}
        setOpenCreateMenu={setOpenCreateMenu}
        setCreatedPost={setCreatedPost}
      />
      <div className="py-4 flex w-full bg-white/60 border-b container backdrop-blur-md sticky top-0">
        <Input
          className="w-full"
          placeholder="Apa sih yang lu pikirin?"
          onFocus={() => setOpenCreateMenu(true)}
        />
      </div>
      <div className="container pt-4 pb-10 w-full">
        <LoadingState
          data={postResponse?.data}
          loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
        >
          <EmptyState
            status={postResponse?.status!}
            message={postResponse?.message!}
          >
            {postResponse?.status}
          </EmptyState>
        </LoadingState>
      </div>
    </>
  );
};

export default Forum;
