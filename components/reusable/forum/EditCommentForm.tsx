"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ERROR_MSG } from "@/lib/constant/error.constant";
import { trpc } from "@/lib/trpc";
import { user } from "@prisma/client";
import React, { useState } from "react";
import InputComment from "./InputComment";

type TProps = {
  openEditMenu: boolean;
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void;
  comment_id: number;
  text: string;
  onCommentChange: () => void;
};

const EditCommentForm: React.FC<TProps> = ({
  openEditMenu,
  setOpenEditMenu,
  comment_id,
  text,
  onCommentChange
}) => {
  const { toast } = useToast();

  const [commentText, setCommentText] = useState(text);
  const [mentionUserIds, setMentionUserIds] = useState<user["id"][]>([]);

  const { mutate: editComment, isPending } =
    trpc.comment.editComment.useMutation();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const countOfMentionUserInComment = commentText
      .split(" ")
      .filter((comment) => comment.startsWith("@")).length;

    const correctedMentionedUserIds = mentionUserIds.slice(
      0,
      countOfMentionUserInComment
    );

    editComment(
      {
        comment_id,
        text: commentText,
        mention_users: correctedMentionedUserIds,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Notifikasi",
            description: data.message,
          });

          setOpenEditMenu(false);

          onCommentChange();
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
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${
        openEditMenu ? "flex " : "hidden"
      }`}
    >
      <Card>
        <CardHeader>
          <CardTitle>Edit Komentar</CardTitle>
          <CardDescription>
            Kalo typo, atau ngerasa gk enak mending edit dah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <InputComment
              commentText={commentText}
              setCommentText={setCommentText}
              mentionUserIds={mentionUserIds}
              setMentionUserIds={setMentionUserIds}
            />

            <div className="mt-2 flex gap-2">
              <Button type="submit" disabled={isPending} className="w-1/2">
                {isPending ? "Proses..." : "Edit Komen"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => setOpenEditMenu(false)}
              >
                Gak Jadi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCommentForm;
