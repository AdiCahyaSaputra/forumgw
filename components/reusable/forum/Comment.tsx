"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMetaData } from "@/lib/helper/str.helper";
import { useAuth } from "@/lib/hook/auth.hook";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Balancer from "react-wrap-balancer";
import DeleteCommentDialog from "./DeleteCommentDialog";
import EditCommentForm from "./EditCommentForm";
import ReplyCommentList from "./ReplyCommentList";

type TProps = {
  id: number;
  text: string;
  created_at: string;
  user?: {
    username: string;
    image: string | null;
  } | null;
  _count: {
    reply_comment: number;
  };
  replyCommentOpenByDefault: boolean;
  onCommentChange: () => void;
};

const Comment: React.FC<TProps> = ({
  id,
  text,
  created_at,
  user,
  _count,
  replyCommentOpenByDefault,
  onCommentChange,
}) => {
  const { currentUser } = useAuth();

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openReplyComments, setOpenReplyComments] = useState(replyCommentOpenByDefault);

  const [replyCommentCount, setReplyCommentCount] = useState(
    _count.reply_comment
  );

  return (
    <>
      <EditCommentForm
        openEditMenu={openEditMenu}
        setOpenEditMenu={setOpenEditMenu}
        comment_id={id}
        text={text}
        onCommentChange={onCommentChange}
      />
      <DeleteCommentDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        comment_id={id}
        onCommentChange={onCommentChange}
      />
      <div
        className={`bg-white border rounded-md grow w-full ${
          openReplyComments ? "border-foreground" : "overflow-hidden"
        }`}
      >
        <div className="flex px-3 pt-3 justify-between items-start w-full">
          <div className="flex gap-2 items-start">
            <Avatar className="w-10 h-10 rounded-md">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback className="rounded-md">
                {user?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
          </div>

          {currentUser.username === user?.username && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="w-max flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <Menu className="w-4 aspect-square" />
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

        <p className="mt-2 cst-wrap-text px-3">
          <Balancer>{text}</Balancer>
        </p>

        <Button
          variant="outline"
          size="sm"
          className={`text-foreground/60 flex w-full justify-between items-center mt-2 rounded-none border-x-0 ${
            !openReplyComments && "border-b-0"
          }`}
          type="button"
          onClick={() => setOpenReplyComments(!openReplyComments)}
        >
          <span>{replyCommentCount} Tanggapan Komentar</span>
          {openReplyComments ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {openReplyComments && (
          <ReplyCommentList
            commentId={id}
            replyCommentCount={replyCommentCount}
            setReplyCommentCount={setReplyCommentCount}
          />
        )}
      </div>
    </>
  );
};

export default Comment;
