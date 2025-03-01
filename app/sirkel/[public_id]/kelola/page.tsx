"use client";

import CardPost from "@/components/reusable/kelola/CardPost";
import FilterPostDropdown from "@/components/reusable/kelola/FilterPostDropdown";
import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { use, useState } from "react";

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

type Props = {
  params: Promise<{
    public_id: string;
  }>;
};

const KelolaGroupPostPage = ({ params }: Props) => {
  const { public_id } = use(params);

  const [filter, setFilter] = useState<"Public" | "Anonymous" | "Semua">(
    "Semua"
  );

  const { data: postResponse, refetch } =
    trpc.group.getGroupPostByAuthor.useQuery({
      group_public_id: public_id,
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
      <SubMenuHeader backUrl={`/sirkel/${public_id}`} title="Kelola Post" />

      <div className="container">
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
                    <CardPost {...post} key={idx} onPostChanges={() => refetch()} />
                  ))}
              </div>
            </LoadingState>
          </EmptyState>
        </div>
      </div>
    </>
  );
};

export default KelolaGroupPostPage;
