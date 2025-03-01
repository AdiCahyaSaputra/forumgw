"use client";

import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";

type TInviteHandle = {
  type: "accept" | "decline";
  invite_id: number;
  group_id: string;
};

const UndanganPage = () => {
  const { data: invitationResponse, refetch } =
    trpc.group.getGroupInvitation.useQuery();
  const { mutate: acceptOrDeclineInvite, isPending } =
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
            description: DEFAULT_ERROR_MSG,
          });

          console.log(err);
          refetch();
        },
      }
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
                      mengundang kamu buat join sirkel ini
                    </p>
                    <Separator className="my-2" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        disabled={isPending}
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
                        disabled={isPending}
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
