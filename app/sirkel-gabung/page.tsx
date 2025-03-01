"use client";
import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { truncateThousand } from "@/lib/helper/str.helper";
import { useDebounce } from "@/lib/hook/debounce.hook";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { useState } from "react";

const GabungSirkelPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchTermDebounce = useDebounce(searchTerm);
  const { toast } = useToast();

  const { data: groupResponse } = trpc.group.getGroupByQuery.useQuery({
    searchTerm: searchTermDebounce || null,
  });

  const { mutate: askToJoinGroup, isPending } =
    trpc.group.askToJoinGroup.useMutation();

  const handleJoinRequest = (public_id: string) => {
    askToJoinGroup(
      {
        public_id,
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

          console.log(err);
        },
      }
    );
  };

  return (
    <div className="h-[3000px]">
      <SubMenuHeader backUrl="/sirkel" title="Gabung dan Cari Sirkel" />

      <div className="mt-4 container">
        <h2 className="text-lg font-bold mt-4">Eksplor Sirkel</h2>
        <p className="text-foreground/60">
          Cari sirkel yang se-frekuensi ama dirimu
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nama Sirkel"
          />
        </div>

        <ul className="mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <LoadingState
            data={groupResponse}
            loadingFallback={
              <Skeleton className="py-8 w-full bg-muted rounded-md" />
            }
          >
            <EmptyState
              status={groupResponse?.status}
              message={groupResponse?.message}
            >
              {groupResponse?.data?.map((group, idx) => (
                <li key={idx}>
                  <Card className="w-full">
                    <CardContent className="p-4 flex flex-col items-start justify-between space-y-2">
                      <div>
                        <Link
                          className="font-bold hover:underline"
                          href={`/sirkel/${group.public_id}`}
                        >
                          {group.name}
                        </Link>
                        <CardDescription className="line-clamp-1">
                          {group.description}
                        </CardDescription>
                      </div>
                      <p className="text-sm text-foreground">
                        <span className="font-bold">
                          {truncateThousand(group._count.group_member)}
                        </span>{" "}
                        Member
                      </p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-4 flex-col items-start space-x-0">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold">Ingfo Leader</h3>
                        <div className="flex items-start gap-2">
                          <Avatar className="rounded-md">
                            <AvatarImage src={group.leader.image ?? ""} />
                            <AvatarFallback className="rounded-md bg-muted">
                              {group.leader.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="text-sm">
                            <h4 className="font-bold">{group.leader.name}</h4>
                            <p className="text-foreground/60">
                              {group.leader.username}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinRequest(group.public_id)}
                        className="w-full mt-4"
                        disabled={group.isMember || isPending}
                      >
                        {isPending
                          ? "Proses..."
                          : group.isMember
                          ? "Udah Join Kok"
                          : "Join Sekarang"}
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </EmptyState>
          </LoadingState>
        </ul>
      </div>
    </div>
  );
};

export default GabungSirkelPage;
