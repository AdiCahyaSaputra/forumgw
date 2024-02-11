"use client";

import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/lib/hook/auth.hook";
// import { useWebSocket } from "@/lib/hook/websocket.hook";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import React from "react";

const SirkelPage: React.FC = () => {
  // const socket = useWebSocket();
  // const { currentUser } = useAuth();

  // const [groups, setGroups] = useState<{ room_id: string; online: number }[]>(
  //   [],
  // );

  const { data: groupResponse } = trpc.group.getAllGroupByUser.useQuery();

  // const getOnlineCount = (group_id: string) => {
  //   const group = groups.find((group) => group.room_id === group_id);
  //
  //   return group?.online;
  // };

  // useEffect(() => {
  //   socket.on("update-online-count", (updatedGroup) => {
  //     // console.log("from socket ", updatedGroup);
  //     // console.log("before setGroups");
  //
  //     setGroups((prevGroups) => {
  //       const currentGroupIdx = prevGroups.findIndex(
  //         (group) => group.room_id === updatedGroup.room_id,
  //       );
  //
  //       // console.log("group idx ", currentGroupIdx);
  //
  //       if (currentGroupIdx !== -1) {
  //         const updatedGroups = prevGroups.map((group, idx) => {
  //           if (idx === currentGroupIdx) {
  //             return {
  //               room_id: group.room_id,
  //               online: updatedGroup.online,
  //             };
  //           }
  //
  //           return group;
  //         });
  //
  //         // console.log(updatedGroups);
  //
  //         return updatedGroups;
  //       }
  //
  //       return [...prevGroups, updatedGroup];
  //     });
  //
  //     // console.log("upgrade groups state ");
  //     // console.log("after setGroups");
  //   });
  // });

  // useEffect(() => {
  //   if (currentUser && groupResponse?.data) {
  //     const rooms_id = groupResponse.data.map(({ group }) => group.public_id);
  //     socket.emit("join_rooms", {
  //       rooms: rooms_id,
  //       username: currentUser.username,
  //     });
  //   }
  // }, [currentUser, groupResponse]);

  // useEffect(() => {
  //   console.log("groups useEffect ", groups);
  // }, [groups]);

  return (
    <div className="container">
      <h2 className="text-lg font-bold mt-4">Sirkel Khusus</h2>
      <p className="text-foreground/60">
        Sebuah tempat dimana lu berkumpul dan berdiskusi dengan orang-orang yang
        lu pilih
      </p>
      <div className="flex gap-2 mt-4">
        <Link href="/sirkel-baru">
          <Button>Buat Sirkel</Button>
        </Link>
        <Link href="/sirkel-gabung">
          <Button variant="outline">Gabung Sirkel</Button>
        </Link>
      </div>

      <ul className="mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <LoadingState
          data={groupResponse}
          loadingFallback={<Skeleton className="py-4 w-full rounded-md" />}
        >
          <EmptyState
            status={groupResponse?.status}
            message={groupResponse?.message}
          >
            {groupResponse?.data?.map(({ group }, idx) => (
              <li key={idx}>
                <Link href={`/sirkel/${group.public_id}`}>
                  <Card className="w-full">
                    <CardContent className="p-4 flex flex-row items-start space-x-2">
                      <div>
                        <h2 className="font-bold">{group.name}</h2>
                        <CardDescription className="line-clamp-2">
                          {group.description}
                        </CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </EmptyState>
        </LoadingState>
      </ul>
    </div>
  );
};

export default SirkelPage;
