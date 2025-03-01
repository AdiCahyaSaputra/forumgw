"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { getMetaData } from "@/lib/helper/str.helper";
import Tag from "@/lib/interface/Tag";
import { trpc } from "@/lib/trpc";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Balancer from "react-wrap-balancer";
import EditPostForm from "./EditPostForm";

type TProps = {
  id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    username: string;
    image: string | null;
    id: string;
  } | null;
  anonymous?: {
    username: string;
    id: string;
  } | null;
  tag_post: {
    tag: Tag;
  }[];
  _count: {
    comments: number;
  };
  onPostChanges: () => void;
};

const CardPost: React.FC<TProps> = ({
  id,
  content,
  created_at,
  user,
  anonymous,
  tag_post,
  onPostChanges
}) => {
  const [openEditMenu, setOpenEditMenu] = useState(false);

  const { toast } = useToast();

  const { mutate: deletePost } = trpc.post.deletePost.useMutation();

  const deleteHandler = () => {
    deletePost(
      {
        post_id: id,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          onPostChanges();
        },
        onError: (error) => {
          toast({
            title: "Notifikasi",
            description: DEFAULT_ERROR_MSG,
          });

          console.error(error);
        },
      }
    );
  };

  return (
    <>
      <EditPostForm
        openEditMenu={openEditMenu}
        setOpenEditMenu={setOpenEditMenu}
        post_id={id}
        tag_post={tag_post}
        content={content}
        isAnonymous={!!anonymous}
        onPostChanges={onPostChanges}
      />
      <Card>
        <CardTitle
          className={`p-4 pb-0 group ${!anonymous && "cursor-pointer"}`}
        >
          <div className="flex items-start gap-4">
            <Avatar className="rounded-md">
              <AvatarImage src={(user && user.image) ?? ""} />
              <AvatarFallback className="rounded-md">
                {(user && user.name[0].toUpperCase()) ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className={`${!anonymous && "group-hover:underline"}`}>
                {anonymous ? "Anonymous" : user && user.name}
              </h2>
              <p
                className={`text-foreground/60 ${
                  !anonymous && "group-hover:underline"
                }`}
              >
                {anonymous ? anonymous.username : user && user.username}
              </p>
            </div>
          </div>
        </CardTitle>
        <CardContent className="p-4 pt-2">
          <div>
            <small className="text-foreground/60 font-bold">
              Dibuat saat {getMetaData(created_at)}
            </small>

            {tag_post.length > 0 && (
              <div className="py-2 space-x-2">
                {tag_post.map(({ tag }, idx) => {
                  return (
                    <Link href={`/forum?c=fyp&t=${tag.id}`} key={idx}>
                      <Badge
                        variant="outline"
                        className="w-max hover:bg-muted cursor-pointer"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <p className="mt-1 cst-wrap-text">
            <Balancer>{content}</Balancer>
          </p>
        </CardContent>
        <CardFooter className="p-0 flex-col items-start pb-2">
          <Separator className="mb-2" />
          <div className="space-x-2 px-4 py-2">
            <Button
              onClick={() => setOpenEditMenu(true)}
              variant="outline"
              size="icon"
            >
              <Pencil className="w-5 aspect-square" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-5 aspect-square" />
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
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardPost;
