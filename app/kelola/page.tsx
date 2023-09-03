"use client";

import CardPost from "@/components/reusable/kelola/CardPost";
import FilterPostDropdown from "@/components/reusable/kelola/FilterPostDropdown";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TAuthUser } from "@/lib/helper/auth.helper";
import { trpc } from "@/lib/trpc";
import { Search } from "lucide-react";
import { useState } from "react";

type TPost = {
  id: string;
  content: string;
  createdAt: string;
  User?: {
    name: string;
    username: string;
    image: string | null;
    id: string;
  } | null;
  Anonymous?: {
    username: string;
    id: string;
  } | null;
};

type TProps = {
  user: TAuthUser;
};

const KelolaPostingan: React.FC<TProps> = ({ user }) => {
  const [filter, setFilter] = useState<"Public" | "Anonymous" | "Semua">(
    "Semua"
  );

  const { data: postResponse, refetch } = trpc.post.getUserPosts.useQuery({
    withAnonymousPosts: true,
  });

  const getFilteredPost = (post: TPost) => {
    const filteredPostCond = {
      Semua: post,
      Public: post.Anonymous === null,
      Anonymous: post.User === null,
    };

    return filteredPostCond[filter];
  };

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Semua Postingan Lu</h2>
      <p className="text-foreground/60">Kelola semua postingan lu disini bre</p>

      <div className="mt-8">
        <div className="relative mb-2">
          <Input type="text" placeholder="Cari Postingan" />
          <Button className="absolute inset-y-0 right-0 px-4 py-1 bg-foreground rounded-none rounded-r-md flex items-center gap-2">
            <Search className="w-4 aspect-square stroke-background" />
          </Button>
        </div>

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
                  <CardPost {...post} key={idx} />
                ))}
            </div>
          </LoadingState>
        </EmptyState>
      </div>
    </>
  );
};

export default KelolaPostingan;
