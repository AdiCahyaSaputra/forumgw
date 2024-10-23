"use client";

import FilterNotifDropdown from "@/components/reusable/notifikasi/FilterNotifDropdown";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { NotificationType } from "@/lib/helper/enum.helper";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { useState } from "react";

const Notifikasi = () => {
  const [filter, setFilter] = useState<"Dibaca" | "Belum Dibaca" | "Semua">(
    "Belum Dibaca",
  );

  const { data: notificationResponse, refetch: notificationRefetch } =
    trpc.notification.getNotification.useQuery();

  const { toast } = useToast();

  const { mutate: thisNotificationHasBeenReaded } =
    trpc.notification.notificationIsReaded.useMutation();

  const getFilteredNotif = () => {
    return notificationResponse?.data.filter((notif) => {
      if (filter === "Belum Dibaca") return !notif.is_read;
      if (filter === "Dibaca") return notif.is_read;

      return notif;
    });
  };

  const getNotifMessage = (type: string) => {
    if (type === NotificationType.comment) {
      return `mengomentari postingan anda`;
    }

    if (type === NotificationType.report) {
      return `melaporkan postingan anda`;
    }
  };

  const makeItReaded = (id: string) => {
    thisNotificationHasBeenReaded(
      {
        notification_id: id,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          notificationRefetch();
        },
      },
    );
  };

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Notifikasi Tentang Kehidupan</h2>
      <p className="text-foreground/60">
        Sesuatu yang mungkin kamu tungguin terus padahal gak berguna
      </p>

      <div className="mt-8 pb-10">
        <FilterNotifDropdown filter={filter} setFilter={setFilter} />

        <ul className="mt-2 space-y-2">
          <EmptyState
            status={getFilteredNotif()?.length ? 200 : 404}
            message="Akun nya sepi bre yahaha"
          >
            <LoadingState
              data={notificationResponse?.data}
              loadingFallback={
                <Skeleton className="h-16 rounded-md bg-secondary w-full" />
              }
            >
              {getFilteredNotif()?.map((notif, idx) => (
                <li
                  className="p-2 rounded-md w-full bg-muted flex justify-between items-center"
                  key={idx}
                >
                  <Link
                    href={`/forum/${notif.post.public_id}`}
                    onClick={() => !notif.is_read && makeItReaded(notif.id)}
                  >
                    <span className="font-bold">{notif.user.username}</span>{" "}
                    {getNotifMessage(notif.type)}
                  </Link>
                  {!notif.is_read && (
                    <Button size="sm" onClick={() => makeItReaded(notif.id)}>
                      Dilihat
                    </Button>
                  )}
                </li>
              ))}
            </LoadingState>
          </EmptyState>
        </ul>
      </div>
    </>
  );
};

export default Notifikasi;
