"use client";

import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import CardForumSirkel from "@/components/reusable/sirkel/CardForumSirkel";
import CreateGroupPostForm from "@/components/reusable/sirkel/CreateGroupPostForm";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateThousand } from "@/lib/helper/str.helper";
import { trpc } from "@/lib/trpc";
import { ListPlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    public_id: string;
  };
};

const SirkelDetailPage = ({ params }: Props) => {
  const { data: groupResponse, refetch } =
    trpc.group.getGroupByPublicId.useQuery({
      public_id: params.public_id,
    });

  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  useEffect(() => {
    if (createdPost) {
      refetch();

      setCreatedPost(false);
      setOpenCreateMenu(false);
    }
    console.log(groupResponse);
  }, [createdPost, groupResponse]);

  return (
    <>
      <SubMenuHeader title="Sirkel" backUrl="/sirkel" />

      {groupResponse?.data?.public_id && (
        <CreateGroupPostForm
          openCreateMenu={openCreateMenu}
          setOpenCreateMenu={setOpenCreateMenu}
          setCreatedPost={setCreatedPost}
          group_public_id={groupResponse.data.public_id}
        />
      )}

      <div className="container pb-10">
        <LoadingState
          data={groupResponse}
          loadingFallback={
            <Skeleton className="py-20 mt-4 rounded-md w-full" />
          }
        >
          <div className="mt-4 p-4 border rounded-md shadow-md">
            <h2 className="font-bold text-lg">{groupResponse?.data?.name}</h2>
            <p className="text-foreground/60">
              {groupResponse?.data?.description}
            </p>

            <p className="text-sm text-foreground mt-2">
              <span className="font-bold">
                {truncateThousand(
                  groupResponse?.data?._count.group_member || 0,
                )}
              </span>{" "}
              Member
            </p>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-sm font-bold">Ingfo Leader</h3>
              <div className="flex items-start gap-2">
                <Avatar className="rounded-md">
                  <AvatarImage src={groupResponse?.data?.leader.image ?? ""} />
                  <AvatarFallback className="rounded-md bg-muted">
                    {groupResponse?.data?.leader.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="text-sm">
                  <h4 className="font-bold">
                    {groupResponse?.data?.leader.name}
                  </h4>
                  <p className="text-foreground/60">
                    {groupResponse?.data?.leader.username}
                  </p>
                </div>
              </div>

              {!groupResponse?.data?.isMember && <Button>Join Sekarang</Button>}
            </div>
          </div>
        </LoadingState>

        <h2 className="font-bold text-lg mt-4">Postingan Di Sirkel Ini</h2>

        {groupResponse?.data?.isMember && (
          <Button
            className="mt-2 w-full flex justify-between gap-2"
            variant="default"
            onClick={() => setOpenCreateMenu(true)}
          >
            <span>Bikin Postingan Baru</span>
            <ListPlusIcon className="w-5 h-5" />
          </Button>
        )}

        <div className="mt-4 w-full space-y-4">
          <EmptyState
            status={groupResponse?.data?.post.length ? 200 : 404}
            message={
              groupResponse?.data?.post.length
                ? "Ada post baru ni bre"
                : "Sirkel ini sepi bjir kagak ada postingan"
            }
          >
            <LoadingState
              data={groupResponse?.data}
              loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
            >
              {groupResponse?.data?.post?.map((post, idx) => (
                <CardForumSirkel
                  isMember={groupResponse?.data.isMember}
                  groupPublicId={groupResponse?.data.public_id}
                  key={idx}
                  {...post}
                />
              ))}
            </LoadingState>
          </EmptyState>
        </div>
      </div>
    </>
  );
};

export default SirkelDetailPage;
