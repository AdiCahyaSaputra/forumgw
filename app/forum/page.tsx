"use client";

import CardForum from "@/components/reusable/forum/CardForum";
import CreatePostForm from "@/components/reusable/forum/CreatePostForm";
import FilterTag from "@/components/reusable/forum/FilterTag";
import ObserverPlaceholder from "@/components/reusable/forum/ObserverPlaceholder";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Forum: React.FC = () => {
  const query = useSearchParams();
  const category = query?.get("c");
  const tag_ids = query?.get("t") || null;
  const category_id = category === "fyp" ? "1" : category === "dev" ? "2" : "1";

  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  const {
    data: postResponse,
    refetch,
    fetchNextPage,
  } = trpc.post.getFeedByCategoryAndTag.useInfiniteQuery(
    {
      category_id,
      tag_ids: tag_ids?.split(",") || [],
    },
    {
      getNextPageParam: (lastPost) => lastPost?.data?.cursor!,
    },
  );

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
      <div className="py-4 flex w-full bg-white supports-backdrop-filter:bg-white/60 border-b container supports-backdrop-filter:backdrop-blur-md sticky z-10 top-0">
        <Input
          className="w-full"
          placeholder="Ada berita apa hari ini? Cerita yuk"
          onFocus={() => setOpenCreateMenu(true)}
        />
      </div>

      <div className="container pt-4 pb-10 w-full space-y-4">
        {tag_ids && <FilterTag />}
        <EmptyState
          status={postResponse?.pages[0].status}
          message={postResponse?.pages[0].message}
        >
          <LoadingState
            data={postResponse?.pages[0].data}
            loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
          >
            {postResponse?.pages.map((response) => {
              return response.data?.posts.map((post, idx) => (
                <CardForum key={idx} {...post} />
              ));
            })}
          </LoadingState>
        </EmptyState>

        {!!postResponse?.pages[postResponse?.pages.length - 1]?.data
          ?.cursor && (
            <ObserverPlaceholder
              callback={() => {
                fetchNextPage();
              }}
            />
          )}
      </div>
    </>
  );
};

export default Forum;
