"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/reusable/state/EmptyState";
import { useToast } from "@/components/ui/use-toast";

type TInviteHandle = {
  type: "accept" | "decline";
  invite_id: number;
  group_id: string;
};

const UndanganPage = () => {
  const { data: invitationResponse, refetch } =
    trpc.group.getGroupInvitation.useQuery();
  const { mutate: acceptOrDeclineInvite, isLoading } =
    trpc.group.acceptOrDeclineInvite.useMutation();

  const { toast } = useToast();

  const handleInvite = ({ type, invite_id, group_id }: TInviteHandle) => {
    acceptOrDeclineInvite(
      {
        type,
        invite_id,
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
            description: "Kayak nya ada error deh",
          });

          console.log(err);
          refetch();
        },
      },
    );
  };

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Undangan</h2>
      <p className="text-foreground/60">
        Join sirkel orang melalui jalur undangan
      </p>

      <ul className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-4">
        <LoadingState
          data={invitationResponse}
          loadingFallback={<Skeleton className="py-20 w-full" />}
        >
          <EmptyState
            status={invitationResponse?.status}
            message={invitationResponse?.message}
          >
            {invitationResponse?.data?.map((invitation, idx) => (
              <li key={idx}>
                <Card>
                  <CardHeader>
                    <CardTitle>{invitation.group.name}</CardTitle>
                    <CardDescription>
                      {invitation.group.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <span className="font-bold">
                        {invitation.group.leader.username}
                      </span>{" "}
                      ngundang lu buat join sirkel ini
                    </p>
                    <Separator className="my-2" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleInvite({
                            type: "accept",
                            invite_id: invitation.id,
                            group_id: invitation.group.id,
                          })
                        }
                      >
                        Ayo aja 😎
                      </Button>
                      <Button
                        disabled={isLoading}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleInvite({
                            type: "decline",
                            invite_id: invitation.id,
                            group_id: invitation.group.id,
                          })
                        }
                      >
                        Gak dulu 😜
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </EmptyState>
        </LoadingState>
      </ul>
    </>
  );
};

export default UndanganPage;
