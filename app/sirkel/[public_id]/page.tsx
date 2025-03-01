"use client";

import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import CardForumSirkel from "@/components/reusable/sirkel/CardForumSirkel";
import CreateGroupPostForm from "@/components/reusable/sirkel/CreateGroupPostForm";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { truncateThousand } from "@/lib/helper/str.helper";
import { trpc } from "@/lib/trpc";
import { ListPlusIcon, TextSelectIcon, UserCogIcon } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{
    public_id: string;
  }>;
};

const SirkelDetailPage = ({ params }: Props) => {
  const { public_id } = use(params);

  const { data: groupResponse, refetch } =
    trpc.group.getGroupByPublicId.useQuery({
      public_id: public_id,
    });

  const { mutate: exitFromGroup } = trpc.group.exitFromGroup.useMutation();
  const { mutate: askToJoinGroup, isPending } =
    trpc.group.askToJoinGroup.useMutation();

  const { toast } = useToast();

  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [createdPost, setCreatedPost] = useState(false);

  const handleJoinRequest = () => {
    askToJoinGroup(
      {
        public_id: public_id,
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Notifikasi",
            description: response.message,
          });
        },
        onError: (err) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          console.error(err);
        },
      },
    );
  };

  const handleExitFromGroup = () => {
    exitFromGroup(
      {
        public_id: public_id,
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Notifikasi",
            description: response.message,
          });

          refetch();
        },
        onError: (err) => {
          toast({
            title: "Notifikasi",
            description: "Duh error bre",
          });

          console.log(err);
        },
      },
    );
  };

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

            <div className="space-y-4">
              <div className="space-y-2 pb-4">
                <h3 className="text-sm font-bold">Ingfo Leader</h3>
                <div className="flex items-start gap-2">
                  <Avatar className="rounded-md">
                    <AvatarImage
                      src={groupResponse?.data?.leader.image ?? ""}
                    />
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
              </div>

              {groupResponse?.data?.isMember &&
                !groupResponse.data.isLeader && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Keluar Dari Sini</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Keluar Sirkel?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Yakin bang mau keluar dari sirkel ini?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Gk Jadi</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExitFromGroup}>
                          Yaudh Sih
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              {!groupResponse?.data?.isMember && (
                <Button onClick={handleJoinRequest}>Join Sekarang</Button>
              )}
              {groupResponse?.data?.isLeader && (
                <Link href={`/sirkel/${public_id}/request-join`}>
                  <Button className="flex items-center gap-2">
                    <UserCogIcon className="w-5 h-5" />
                    <span>Permintaan Join Sirkel</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </LoadingState>

        <h2 className="font-bold text-lg mt-4">Postingan Di Sirkel Ini</h2>

        {groupResponse?.data?.isMember && (
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              className="mt-2 w-full flex justify-between gap-2"
              variant="default"
              onClick={() => setOpenCreateMenu(true)}
            >
              <span>Bikin Postingan Baru</span>
              <ListPlusIcon className="w-5 h-5" />
            </Button>
            <Link
              href={`/sirkel/${public_id}/kelola`}
              className="w-full"
            >
              <Button
                className="mt-2 w-full flex justify-between gap-2"
                variant="outline"
              >
                <span>Kelola Postingan Grup</span>
                <TextSelectIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
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
