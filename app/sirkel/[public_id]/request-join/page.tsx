"use client";

import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { use } from "react";

type Props = {
  params: Promise<{
    public_id: string;
  }>;
};

type TJoinRequestHandle = {
  type: "accept" | "decline";
  request_id: number;
  group_id: string;
};

const RequestJoinPage = ({ params }: Props) => {
  const { public_id } = use(params);

  const { data: usersResponse, refetch } =
    trpc.group.getGroupJoinRequest.useQuery({
      public_id: public_id,
    });

  const { mutate: acceptOrDeclineJoinRequest, isPending } =
    trpc.group.acceptOrDeclineJoinRequest.useMutation();

  const { toast } = useToast();

  const handleJoinRequest = ({
    type,
    request_id,
    group_id,
  }: TJoinRequestHandle) => {
    acceptOrDeclineJoinRequest(
      {
        type,
        request_id,
        group_id,
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
            description: DEFAULT_ERROR_MSG,
          });

          console.error(err);
        },
      }
    );
  };

  return (
    <>
      <SubMenuHeader
        title="Permintaan Join Sirkel"
        backUrl={`/sirkel/${public_id}`}
      />

      <div className="container mt-4">
        <ul className="space-y-2">
          <LoadingState
            data={usersResponse}
            loadingFallback={<Skeleton className="w-full py-8 rounded-md" />}
          >
            <EmptyState
              status={usersResponse?.status}
              message={usersResponse?.message}
            >
              {usersResponse?.data?.map((request, idx) => (
                <li key={idx} className="p-4 border rounded-md">
                  <div className="flex space-x-2">
                    <Avatar className="rounded-md">
                      <AvatarImage src={request.user.image ?? ""} />
                      <AvatarFallback className="rounded-md bg-muted">
                        {request.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <Link
                        className="group"
                        href={`/profil/${request.user.username}`}
                      >
                        <h4 className="font-bold group-hover:underline">
                          {request.user.name}
                        </h4>
                        <p className="text-foreground/60 text-sm group-hover:underline">
                          {request.user.username}
                        </p>
                      </Link>

                      <div className="mt-4 flex gap-2">
                        <Button
                          disabled={isPending}
                          onClick={() =>
                            handleJoinRequest({
                              type: "accept",
                              request_id: request.id,
                              group_id: request.group_id,
                            })
                          }
                        >
                          Terima&nbsp;😁
                        </Button>
                        <Button
                          disabled={isPending}
                          onClick={() =>
                            handleJoinRequest({
                              type: "decline",
                              request_id: request.id,
                              group_id: request.group_id,
                            })
                          }
                          variant="outline"
                        >
                          Tolak&nbsp;😒
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </EmptyState>
          </LoadingState>
        </ul>
      </div>
    </>
  );
};

export default RequestJoinPage;
