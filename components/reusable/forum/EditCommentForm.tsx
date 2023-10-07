"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import React, { useState } from "react";

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

  const { mutate: editComment, isLoading } =
    trpc.comment.editComment.useMutation();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    editComment(
      {
        comment_id,
        text: commentText,
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
      },
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-md z-20 items-center justify-center ${openEditMenu ? "flex " : "hidden"
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
            <Input
              type="text"
              placeholder="Komentar..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus={true}
              required
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
