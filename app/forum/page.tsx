"use client";

import CardForum from "@/components/reusable/forum/CardForum";
import CreatePostForm from "@/components/reusable/forum/CreatePostForm";
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
  const category_id = category === "fyp" ? "1" : category === "dev" ? "2" : "1";

  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  const { data: postResponse, refetch } = trpc.post.getFeedByCategory.useQuery({
    category_id,
  });

  useEffect(() => {
    if (createdPost) {
      refetch();
      setCreatedPost(false);
      setOpenCreateMenu(false);
    }
  }, [createdPost, postResponse]);

  return (
    <>
      <CreatePostForm
        category_id={category_id}
        openCreateMenu={openCreateMenu}
        setOpenCreateMenu={setOpenCreateMenu}
        setCreatedPost={setCreatedPost}
      />
      <div className="py-4 flex w-full bg-white supports-[backdrop-filter]:bg-white/60 border-b container supports-[backdrop-filter]:backdrop-blur-md sticky z-10 top-0">
        <Input
          className="w-full"
          placeholder="Apa sih yang lu pikirin?"
          onFocus={() => setOpenCreateMenu(true)}
        />
      </div>
      <div className="container pt-4 pb-10 w-full space-y-4">
        <EmptyState
          status={postResponse?.status}
          message={postResponse?.message}
        >
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
          >
            {postResponse?.data?.map((post, idx) => (
              <CardForum key={idx} {...post} />
            ))}
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default Forum;
