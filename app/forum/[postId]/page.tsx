"use client";

import CardForum from "@/components/reusable/forum/CardForum";
import Comment from "@/components/reusable/forum/Comment";
import SubMenuHeader from "@/components/reusable/layout/SubMenuHeader";
import LoadingState from "@/components/reusable/state/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/hook/auth.hook";
import { trpc } from "@/lib/trpc";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";

const CreateCommentLoader = () => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Skeleton className="w-8 h-8 rounded-md" />
      <Skeleton className="grow h-8 rounded-md" />
    </div>
  );
};

const CommentLoader = () => {
  return (
    <div className="flex items-start gap-2 mt-4">
      <Skeleton className="w-10 h-10 rounded-md" />
      <Skeleton className="grow h-24 rounded-md" />
    </div>
  );
};

/**
 * TODO: CRUD Comment
 */

const PostDetail = ({ params }: { params: { postId: string } }) => {
  const { data: postResponse, refetch } = trpc.post.getDetailedPost.useQuery({
    post_id: params.postId,
  });

  const { mutate: createComment, isLoading } =
    trpc.comment.createComment.useMutation();

  const [commentText, setCommentText] = useState("");
  const [response, setResponse] = useState({
    message: "",
  });

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createComment(
      {
        postId: params.postId,
        userId: currentUser.id,
        text: commentText,
      },
      {
        onSuccess: (data) => {
          setResponse(data);
          setCommentText("");
        },
        onError: (error) => {
          setResponse({
            message: "Duh error bre",
          });
          setCommentText("");
          console.log(error);
        },
      },
    );
  };

  useEffect(() => {
    if (!!response.message) {
      toast({
        title: "Notifikasi",
        description: response.message,
      });

      refetch();

      setResponse({
        message: "",
      });
    }
  }, [response]);

  return (
    <>
      <SubMenuHeader
        data={null}
        title="Detail Postingan"
        backUrl="/forum?c=fyp"
      />
      <div className="container mt-4 pb-10">
        <LoadingState
          data={postResponse?.data}
          loadingFallback={
            <Skeleton className="w-full h-24 rounded-md bg-muted" />
          }
        >
          {postResponse?.data && <CardForum {...postResponse.data} />}
        </LoadingState>
        <LoadingState
          data={currentUser}
          loadingFallback={<CreateCommentLoader />}
        >
          {currentUser && (
            <div className="mt-4 flex items-center gap-2">
              <Avatar className="rounded-md w-8 h-8">
                <AvatarImage src={currentUser.image ?? ""} />
                <AvatarFallback className="rounded-md">
                  {currentUser.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <form
                onSubmit={submitHandler}
                className="flex items-center grow gap-2"
              >
                <Input
                  type="text"
                  placeholder="Komentar..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <Button size="icon" type="submit" disabled={isLoading}>
                  <Send className="w-4 aspect-square" />
                </Button>
              </form>
            </div>
          )}
        </LoadingState>
        <div className="mt-4 space-y-2">
          <LoadingState
            data={postResponse?.data}
            loadingFallback={<CommentLoader />}
          >
            {postResponse?.data?.Comment.map((comment) => (
              <Comment
                setResponse={setResponse}
                {...comment}
                key={comment.id}
              />
            ))}
          </LoadingState>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
