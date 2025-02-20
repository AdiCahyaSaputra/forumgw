"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { user } from "@prisma/client";
import React, { useState } from "react";
import InputComment from "./InputComment";

type TProps = {
  openEditMenu: boolean;
  setOpenEditMenu: (value: React.SetStateAction<boolean>) => void;
  setResponse: (value: React.SetStateAction<{ message: string }>) => void;
  comment_id: number;
  text: string;
};

const EditCommentForm: React.FC<TProps> = ({
  openEditMenu,
  setOpenEditMenu,
  setResponse,
  comment_id,
  text,
}) => {
  const [commentText, setCommentText] = useState(text);
  const [mentionUserIds, setMentionUserIds] = useState<user["id"][]>([]);

  const { mutate: editComment, isLoading } =
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
        mention_users: correctedMentionedUserIds
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setOpenEditMenu(false);
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
              <Button type="submit" disabled={isLoading} className="w-1/2">
                {isLoading ? "Proses..." : "Edit Komen"}
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
