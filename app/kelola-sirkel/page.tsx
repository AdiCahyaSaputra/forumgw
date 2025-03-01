"use client";

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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const KelolaSirkelPage = () => {
  const { data: groupResponse, refetch } =
    trpc.group.getGroupByAuthor.useQuery();
  const { mutate: deleteGroup } = trpc.group.deleteGroup.useMutation();

  const [deletedGroupId, setDeletedGroupId] = useState("");

  const { toast } = useToast();

  const deleteHandler = () => {
    deleteGroup(
      {
        group_public_id: deletedGroupId,
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
        },
      },
    );
  };

  return (
    <div className="container">
      <h2 className="text-lg font-bold mt-4">Kelola Sirkel</h2>
      <p className="text-foreground/60">
        Tempat dimana kamu bisa kelola semua sirkel
      </p>

      <ul className="mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <LoadingState
          data={groupResponse}
          loadingFallback={<Skeleton className="py-4 w-full rounded-md" />}
        >
          <EmptyState
            status={groupResponse?.status}
            message={groupResponse?.message}
          >
            {groupResponse?.data?.map((group, idx) => (
              <li key={idx}>
                <Card className="w-full">
                  <CardContent className="p-4 flex flex-row items-start space-x-2">
                    <div>
                      <h2 className="font-bold">{group.name}</h2>
                      <CardDescription className="line-clamp-1">
                        {group.description}
                      </CardDescription>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 flex items-center gap-2">
                    <Link href={`/kelola-sirkel/edit/${group.public_id}`}>
                      <Button size="icon">
                        <PencilIcon className="w-5 h-5" />
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setDeletedGroupId(group.public_id)}
                        >
                          <Trash2Icon className="w-5 aspect-square" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Postingan ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Kalo dah ke hapus g bisa di back up lagi bre
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Gk Jadi</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteHandler}>
                            Yaudh Sih
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </EmptyState>
        </LoadingState>
      </ul>
    </div>
  );
};

export default KelolaSirkelPage;
