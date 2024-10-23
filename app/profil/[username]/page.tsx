"use client";

import CardForum from "@/components/reusable/forum/CardForum";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { use, useEffect, useState } from "react";

const ProfilDetail = ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = use(params);

  const { data: userResponse, refetch } = trpc.user.getProfile.useQuery({
    username,
  });

  const [previewImage, setPreviewImage] = useState(false);

  useEffect(() => {
    console.log(userResponse, username);
    refetch();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-20 ${
          previewImage ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <div>
          <div
            className="w-[300px] h-[300px] bg-muted bg-cover bg-center border"
            style={{
              backgroundImage: `url(${userResponse?.data?.user.image})`,
            }}
          />
          <Button className="mt-2" onClick={() => setPreviewImage(false)}>
            Tutup
          </Button>
        </div>
      </div>
      <div className="w-full bg-black pt-10 pb-4 text-right container">
        <h3 className="text-muted">Halo Bre 👋</h3>
      </div>

      <div className="container">
        <div className="flex flex-col gap-4">
          <Avatar
            onClick={() => setPreviewImage(true)}
            className="w-16 h-16 cursor-pointer -translate-y-[50%] rounded border shadow-md"
          >
            <AvatarImage src={userResponse?.data?.user.image ?? ""} />
            <AvatarFallback className="rounded"></AvatarFallback>
          </Avatar>
          <div className="-translate-y-[50%]">
            <LoadingState
              data={userResponse?.data}
              loadingFallback={
                <Skeleton className="w-full h-10 bg-primary rounded-md" />
              }
            >
              <h4 className="text-lg font-bold">
                {userResponse?.data?.user.name}
              </h4>
            </LoadingState>
            <LoadingState
              data={userResponse?.data}
              loadingFallback={
                <Skeleton className="w-24 h-8 bg-muted rounded-md mt-2" />
              }
            >
              <p className="text-foreground/60 font-bold">
                {userResponse?.data?.user.username}
              </p>
            </LoadingState>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex justify-end items-center gap-4">
          <div className="grow h-px bg-primary" />
          <p className="font-bold">
            Bio <span className="text-red-600">Gw</span>
          </p>
        </div>
        <LoadingState
          data={userResponse?.data}
          loadingFallback={<Skeleton className="w-24 h-8 rounded bg-muted" />}
        >
          <p className="text-sm text-foreground w-[80%]">
            {userResponse?.data?.user.bio}
          </p>
        </LoadingState>
      </div>
      <div className="container mt-8">
        <div className="flex gap-4">
          <p className="font-bold">
            Jejak Digital <span className="text-red-600">Gw</span>
          </p>
          <div className="py-2 translate-y-[50%] grow bg-transparent rounded-tr-md border-t border-r border-t-primary border-r-primary" />
        </div>
        <div className="py-4 pb-10 pr-4 space-y-2 bg-transparent border-r border-r-primary">
          <EmptyState
            status={!userResponse?.data?.posts.length ? 404 : 200}
            message="User ini males posting"
          >
            <LoadingState
              data={userResponse?.data}
              loadingFallback={<Skeleton className="w-full h-24 rounded-md" />}
            >
              {userResponse?.data?.posts.map((post, idx) => (
                <CardForum {...post} user={userResponse.data.user} key={idx} />
              ))}
            </LoadingState>
          </EmptyState>
        </div>
      </div>
    </>
  );
};

export default ProfilDetail;
