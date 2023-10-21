"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMetaData } from "@/lib/helper/str.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import { trpc } from "@/lib/trpc";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import EditCommentForm from "./EditCommentForm";
import { Badge } from "@/components/ui/badge";

type TProps = {
  id: number;
  text: string;
  created_at: string;
  user?: {
    username: string;
    image: string | null;
  } | null;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
};

type TDeleteDialog = {
  comment_id: number;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (value: React.SetStateAction<boolean>) => void;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
};

const DeleteCommentDialog: React.FC<TDeleteDialog> = ({
  comment_id,
  openDeleteDialog,
  setOpenDeleteDialog,
  setResponse,
}) => {
  const { mutate: deleteComment, isLoading } =
    trpc.comment.deleteComment.useMutation();

  const deleteHandler = () => {
    deleteComment(
      {
        comment_id,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenDeleteDialog(false);
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
    <div
      className={`fixed inset-0 z-20 bg-white/60 justify-center items-center ${openDeleteDialog ? "flex" : "hidden"
        }`}
    >
      <Card>
        <CardHeader>
          <CardTitle>Hapus Komentar</CardTitle>
          <CardDescription>
            Cuma sekedar konfirmasi aja sih ini mah awowkwowk 😅
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-2">
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={deleteHandler}
            >
              {isLoading ? "Proses..." : "Yaudah Sih"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Gak Jadi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Comment: React.FC<TProps> = ({
  id,
  text,
  created_at,
  user,
  setResponse,
}) => {
  const { currentUser } = useAuth();

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="flex items-start gap-2">
      <EditCommentForm
        setResponse={setResponse}
        openEditMenu={openEditMenu}
        setOpenEditMenu={setOpenEditMenu}
        comment_id={id}
        text={text}
      />
      <DeleteCommentDialog
        setResponse={setResponse}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        comment_id={id}
      />
      <Avatar className="w-10 h-10 rounded-md">
        <AvatarImage src={user?.image ?? ""} />
        <AvatarFallback className="rounded-md">
          {user?.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="py-2 px-3 bg-white border rounded-md grow">
        <div className="flex justify-between items-start w-full">
          <div>
            <Link href={`/profil/${user?.username}`}>
              <Badge
                variant={
                  currentUser.username === user?.username
                    ? "default"
                    : "outline"
                }
              >
                {user?.username}
              </Badge>
            </Link>
            <p className="text-xs mt-1 text-foreground/60">
              {getMetaData(created_at)}
            </p>
          </div>

          {currentUser.username === user?.username && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="w-max flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <CornerDownLeft className="w-4 aspect-square" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  onClick={() => setOpenEditMenu(true)}
                  className="cursor-pointer"
                >
                  Edit Komen
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenDeleteDialog(true)}
                  className="cursor-pointer focus:bg-destructive focus:text-white"
                >
                  Hapus Komen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="mt-2 break-all">{text}</p>
      </div>
    </div>
  );
};

export default Comment;
