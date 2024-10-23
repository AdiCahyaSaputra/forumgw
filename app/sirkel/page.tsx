"use client";

import EmptyState from "@/components/reusable/state/EmptyState";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import React from "react";

const SirkelPage: React.FC = () => {
  const { data: groupResponse } = trpc.group.getAllGroupByUser.useQuery();

  return (
    <div className="container">
      <h2 className="text-lg font-bold mt-4">Sirkel Khusus</h2>
      <p className="text-foreground/60">
        Sebuah tempat dimana kalian berkumpul dan berdiskusi dengan orang-orang yang
        kalian pilih
      </p>
      <div className="flex gap-2 mt-4">
        <Link href="/sirkel-baru">
          <Button>Buat Sirkel</Button>
        </Link>
        <Link href="/sirkel-gabung">
          <Button variant="outline">Gabung Sirkel</Button>
        </Link>
      </div>

      <ul className="mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
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
