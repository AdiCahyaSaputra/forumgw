"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, CornerDownLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Balancer from "react-wrap-balancer";
import EditCommentForm from "./EditCommentForm";

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
  const { mutate: deleteComment, isPending } =
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
      }
    );
  };

  return (
    <div
      className={`fixed inset-0 z-20 bg-white/60 justify-center items-center ${
        openDeleteDialog ? "flex" : "hidden"
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
              disabled={isPending}
              variant="destructive"
              onClick={deleteHandler}
            >
              {isPending ? "Proses..." : "Yaudah Sih"}
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
    <>
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
      <div className="flex items-start gap-2">
        <Avatar className="w-10 h-10 rounded-md">
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback className="rounded-md">
            {user?.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="p-2 bg-white border rounded-md grow w-full">
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

          <p className="mt-2 cst-wrap-text">
            <Balancer>{text}</Balancer>
          </p>

          <Button variant='outline' size='sm' className="text-foreground/60 flex w-full justify-between items-center mt-5">
            <span>0 Tanggapan Komentar</span>
            <ChevronDown className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Comment;
