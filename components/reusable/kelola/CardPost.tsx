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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMetaData } from "@/lib/helper/str.helper";
import { trpc } from "@/lib/trpc";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import EditPostForm from "./EditPostForm";

type TProps = {
  id: string;
  content: string;
  createdAt: string;
  categoryId: number;
  User?: {
    name: string;
    username: string;
    image: string | null;
    id: string;
  } | null;
  Anonymous?: {
    username: string;
    id: string;
  } | null;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
};

const CardPost: React.FC<TProps> = ({
  id,
  content,
  createdAt,
  categoryId,
  User,
  Anonymous,
  setResponse,
}) => {
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const { mutate: deletePost, isLoading } = trpc.post.deletePost.useMutation();

  const deleteHandler = () => {
    deletePost(
      {
        postId: id,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });

          console.log(error);
        },
      },
    );
  };

  return (
    <>
      <EditPostForm
        categoryId={categoryId}
        openEditMenu={openEditMenu}
        setOpenEditMenu={setOpenEditMenu}
        postId={id}
        content={content}
        isAnonymous={!!Anonymous}
        setResponse={setResponse}
      />
      <Card>
        <CardTitle
          className={`p-4 pb-0 group ${!Anonymous && "cursor-pointer"}`}
        >
          <div className="flex items-start gap-4">
            <Avatar className="rounded-md">
              <AvatarImage src={(User && User.image) ?? ""} />
              <AvatarFallback className="rounded-md">
                {(User && User.name[0].toUpperCase()) ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className={`${!Anonymous && "group-hover:underline"}`}>
                {Anonymous ? "Anonymous" : User && User.name}
              </h2>
              <p
                className={`text-foreground/60 ${
                  !Anonymous && "group-hover:underline"
                }`}
              >
                {Anonymous ? Anonymous.username : User && User.username}
              </p>
            </div>
          </div>
        </CardTitle>
        <CardContent className="p-4 pt-2">
          <div>
            <small className="text-foreground/60 font-bold">
              Dibuat saat {getMetaData(createdAt)}
            </small>
          </div>
          <p className="mt-1">{content}</p>
        </CardContent>
        <CardFooter className="p-0 flex-col items-start pb-2">
          <Separator className="mb-2" />
          <div className="space-x-2 px-4">
            <Button
              onClick={() => setOpenEditMenu(true)}
              variant="ghost"
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
